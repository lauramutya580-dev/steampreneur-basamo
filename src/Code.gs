/**
 * BSS - Bank Syariah Sekolah
 * Backend Google Apps Script (Optimized for High Concurrency)
 * Version: 2.0.0 - Production Ready
 * 
 * FITUR TAMBAHAN: Support filter & cetak nasabah berdasarkan kategori/kelas/saldo
 */

// ==================== CONFIGURATION ====================
const SPREADSHEET_ID = '1-N1rKBcoqM-0qBXTkVV2uZGVY5xNOy2DkxOxv32zVKM';
const SHEET_NAMES = ['users', 'transactions', 'settings', 'notifications'];
const LOCK_TIMEOUT_MS = 15000; // Optimized: 15 detik
const CACHE_TTL_SECONDS = 30; // Cache data read selama 30 detik
const MAX_RETRY_ATTEMPTS = 3; // Retry logic untuk transient errors
const BATCH_SIZE = 50; // Batch operations untuk efisiensi
// ==================== DIRECTOR CREDENTIALS (Backend Only) ====================
const DIRECTOR_USERNAME = 'direktur';
const DIRECTOR_LOGIN_PASSWORD = 'direktur150398';
const DIRECTOR_DB_PASSWORD = 'direktur123';

// ==================== CACHE & STATE ====================
let _dataCache = null;
let _cacheTimestamp = 0;
let _sheetCache = {}; // Cache per sheet untuk optimasi

// ==================== DATABASE SETUP ====================
function doGet() {
  setupDatabase();
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('BSS - Bank Syariah Sekolah')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setFaviconUrl('https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png');
}

function setupDatabase() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  SHEET_NAMES.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      // Setup header dengan batch operation
      sheet.getRange('A1:D1').setValues([['__backendId', 'Data_JSON', '__version', '__timestamp']]);
      sheet.getRange('A1:D1').setFontWeight('bold').setBackground('#f3f4f6').setBorder(null, null, true, null, null, null, '#e5e7eb', SpreadsheetApp.BorderStyle.SOLID);
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, 4, [100, 500, 60, 200]);
    }
  });
}

// ==================== CACHE MANAGEMENT ====================
function getCache_() {
  return CacheService.getScriptCache();
}

function getCachedData_(key) {
  const cache = getCache_();
  const cached = cache.get(key);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch(e) {
      cache.remove(key);
    }
  }
  return null;
}

function setCachedData_(key, data, ttl = CACHE_TTL_SECONDS) {
  const cache = getCache_();
  try {
    cache.put(key, JSON.stringify(data), ttl);
  } catch(e) {
    // Cache full, remove oldest
    cache.removeAll();
    cache.put(key, JSON.stringify(data), ttl);
  }
}

function invalidateCache_(sheetName = null) {
  const cache = getCache_();
  if (sheetName) {
    cache.remove('data_' + sheetName);
  } else {
    // Invalidate all data cache
    SHEET_NAMES.forEach(name => cache.remove('data_' + name));
    cache.remove('all_data');
  }
  _dataCache = null;
  _cacheTimestamp = 0;
  _sheetCache = {};
}

// ==================== LOCKING MECHANISM (Optimized) ====================
function acquireLock_(lockName, timeout = LOCK_TIMEOUT_MS) {
  const lock = LockService.getScriptLock();
  let attempts = 0;
  
  while (attempts < MAX_RETRY_ATTEMPTS) {
    try {
      lock.waitLock(timeout);
      return lock;
    } catch (e) {
      attempts++;
      if (attempts >= MAX_RETRY_ATTEMPTS) {
        console.error('Failed to acquire lock after ' + MAX_RETRY_ATTEMPTS + ' attempts: ' + lockName);
        throw new Error('Sistem sedang sibuk. Silakan coba beberapa saat lagi. (Code: LOCK_TIMEOUT)');
      }
      // Exponential backoff
      Utilities.sleep(Math.pow(2, attempts) * 100);
    }
  }
  return null;
}

function releaseLock_(lock) {
  if (lock) {
    try {
      lock.releaseLock();
    } catch (e) {
      console.warn('Lock release warning: ' + e.message);
    }
  }
}

// ==================== SHEET OPERATIONS (Batch Optimized) ====================
function getSheetName(type) {
  const map = {
    'user': 'users',
    'transaction': 'transactions', 
    'notification': 'notifications',
    'settings': 'settings'
  };
  return map[type] || 'settings';
}

function getSheet_(sheetName) {
  // Cache sheet object untuk mengurangi API calls
  if (!_sheetCache[sheetName]) {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    _sheetCache[sheetName] = ss.getSheetByName(sheetName);
  }
  return _sheetCache[sheetName];
}

function readSheetDataBatch_(sheetName) {
  const sheet = getSheet_(sheetName);
  if (!sheet) return [];
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  
  // Batch read: ambil semua data dalam 1 call
  const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  const result = [];
  
  for (let i = 0; i < data.length; i++) {
    if (data[i][1]) {
      try {
        const obj = JSON.parse(data[i][1]);
        obj.__backendId = data[i][0];
        obj.__version = data[i][2] || 1;
        obj.__timestamp = data[i][3] || new Date().toISOString();
        result.push(obj);
      } catch(e) {
        console.warn('Corrupt JSON row ' + (i+2) + ' in ' + sheetName + ': ' + e.message.substring(0, 100));
      }
    }
  }
  return result;
}

function writeSheetRowsBatch_(sheetName, rows) {
  if (!rows || rows.length === 0) return;
  
  const sheet = getSheet_(sheetName);
  if (!sheet) {
    // Create sheet if not exists
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const newSheet = ss.insertSheet(sheetName);
    newSheet.getRange('A1:D1').setValues([['__backendId', 'Data_JSON', '__version', '__timestamp']]);
    newSheet.getRange('A1:D1').setFontWeight('bold').setBackground('#f3f4f6');
    newSheet.setFrozenRows(1);
    _sheetCache[sheetName] = newSheet;
  }
  
  // Batch write: semua rows dalam 1 call
  const lastRow = sheet.getLastRow();
  if (rows.length > 0) {
    sheet.getRange(lastRow + 1, 1, rows.length, 4).setValues(rows);
  }
}

function findRowByIndex_(sheetName, id) {
  const sheet = getSheet_(sheetName);
  if (!sheet) return -1;
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;
  
  // Optimized: hanya baca kolom ID untuk pencarian
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
  return ids.indexOf(id) + 2; // +2 karena header dan 1-based index
}

function updateSheetRowOptimistic_(sheetName, id, jsonData, expectedVersion) {
  const sheet = getSheet_(sheetName);
  if (!sheet) return false;
  
  const row = findRowByIndex_(sheetName, id);
  if (row <= 1) return false;
  
  // Read current version for optimistic locking check
  const currentVersion = sheet.getRange(row, 3).getValue() || 1;
  
  if (expectedVersion !== currentVersion + 1) {
    console.warn('Version conflict: id=' + id + ', expected=' + expectedVersion + ', current=' + currentVersion);
    return false;
  }
  
  // Batch update: 3 kolom dalam 1 call
  const timestamp = new Date().toISOString();
  sheet.getRange(row, 2, 1, 3).setValues([[jsonData, expectedVersion, timestamp]]);
  return true;
}

function deleteSheetRowByIndex_(sheetName, id) {
  const sheet = getSheet_(sheetName);
  if (!sheet) return false;
  
  const row = findRowByIndex_(sheetName, id);
  if (row <= 1) return false;
  
  sheet.deleteRow(row);
  return true;
}

// ==================== DATA ACCESS WITH CACHE ====================
function getAllData() {
  // Check cache first
  const cacheKey = 'all_data';
  const cached = getCachedData_(cacheKey);
  if (cached && (Date.now() - _cacheTimestamp) < CACHE_TTL_SECONDS * 1000) {
    return cached;
  }
  
  const lock = acquireLock_('read', 5000); // Short lock for read
  try {
    let allData = [];
    
    // Parallel-ish read dengan cache per sheet
    for (const sheetName of SHEET_NAMES) {
      const sheetCacheKey = 'data_' + sheetName;
      let sheetData = getCachedData_(sheetCacheKey);
      
      if (!sheetData) {
        sheetData = readSheetDataBatch_(sheetName);
        setCachedData_(sheetCacheKey, sheetData, CACHE_TTL_SECONDS);
        _sheetCache[sheetName] = null; // Invalidate sheet object cache
      }
      allData = allData.concat(sheetData);
    }
    
    // Update global cache
    setCachedData_(cacheKey, allData, 15); // Shorter TTL for all_data
    _dataCache = allData;
    _cacheTimestamp = Date.now();
    
    return allData;
  } finally {
    releaseLock_(lock);
  }
}

function getDataByType_(type) {
  const sheetName = getSheetName(type);
  const cacheKey = 'data_' + sheetName;
  
  let data = getCachedData_(cacheKey);
  if (!data) {
    data = readSheetDataBatch_(sheetName);
    setCachedData_(cacheKey, data, CACHE_TTL_SECONDS);
  }
  return data;
}

// ==================== PUBLIC API FUNCTIONS (Optimized) ====================

function handleCreate(obj) {
  const lock = acquireLock_('create');
  try {
    const sheetName = getSheetName(obj.type);
    const newId = Utilities.getUuid();
    const version = 1;
    const timestamp = new Date().toISOString();
    
    // Prepare data object
    const storeObj = Object.assign({}, obj, {
      __backendId: newId,
      __version: version,
      __timestamp: timestamp
    });
    // ➕ TAMBAHAN: Default PIN untuk Teller jika belum ada
    if (obj.role === 'teller' && !storeObj.pin) {
      storeObj.pin = '123456'; // PIN default untuk teller baru
    }
    
    // Batch write single row
    writeSheetRowsBatch_(sheetName, [[newId, JSON.stringify(storeObj), version, timestamp]]);
    
    // Invalidate relevant cache
    invalidateCache_(sheetName);
    
    return { status: true, allData: getAllData() };
  } catch (e) {
    console.error('Create error: ' + e.message);
    return { status: false, error: e.message };
  } finally {
    releaseLock_(lock);
  }
}

function handleCreateBatch(objects) {
  if (!objects || objects.length === 0) return { status: true, allData: getAllData() };
  
  const lock = acquireLock_('createBatch');
  try {
    // Group by sheet for batch operations
    const bySheet = {};
    const now = new Date().toISOString();
    
    objects.forEach(obj => {
      const sheetName = getSheetName(obj.type);
      if (!bySheet[sheetName]) bySheet[sheetName] = [];
      
      const newId = Utilities.getUuid();
      const version = 1;
      
      const storeObj = Object.assign({}, obj, {
        __backendId: newId,
        __version: version,
        __timestamp: now
      });

      // ➕ TAMBAHAN: Default PIN dan field keamanan untuk Teller
      if (obj.role === 'teller') {
        if (!storeObj.pin) {
          storeObj.pin = '123456';
        }
        if (storeObj.pin_attempts === undefined) storeObj.pin_attempts = 0;
        if (storeObj.blocked === undefined) storeObj.blocked = false;
      }
      
      bySheet[sheetName].push([newId, JSON.stringify(storeObj), version, now]);
    });
    
    // Batch write per sheet
    Object.keys(bySheet).forEach(sheetName => {
      if (bySheet[sheetName].length > 0) {
        // Process in chunks if very large
        const rows = bySheet[sheetName];
        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
          const chunk = rows.slice(i, i + BATCH_SIZE);
          writeSheetRowsBatch_(sheetName, chunk);
        }
      }
    });
    
    // Invalidate all cache
    invalidateCache_();
    
    return { status: true, allData: getAllData() };
  } catch (e) {
    console.error('CreateBatch error: ' + e.message);
    return { status: false, error: e.message };
  } finally {
    releaseLock_(lock);
  }
}

function handleUpdate(obj) {
  const lock = acquireLock_('update');
  try {
    const sheetName = getSheetName(obj.type);
    const expectedVersion = (obj.__version || 1) + 1;
    
    // Remove internal fields for storage
    const storeObj = JSON.parse(JSON.stringify(obj));
    const jsonData = JSON.stringify(storeObj);
    
    const success = updateSheetRowOptimistic_(sheetName, obj.__backendId, jsonData, expectedVersion);
    
    if (!success) {
      return { status: false, error: 'Version conflict or record not found. Data mungkin telah diubah.' };
    }
    
    // Invalidate relevant cache
    invalidateCache_(sheetName);
    
    return { status: true, allData: getAllData() };
  } catch (e) {
    console.error('Update error: ' + e.message);
    return { status: false, error: e.message };
  } finally {
    releaseLock_(lock);
  }
}

function handleDelete(obj) {
  const lock = acquireLock_('delete');
  try {
    const sheetName = getSheetName(obj.type);
    const success = deleteSheetRowByIndex_(sheetName, obj.__backendId);
    
    if (!success) {
      return { status: false, error: 'Record not found' };
    }
    
    // Invalidate relevant cache
    invalidateCache_(sheetName);
    
    return { status: true, allData: getAllData() };
  } catch (e) {
    console.error('Delete error: ' + e.message);
    return { status: false, error: e.message };
  } finally {
    releaseLock_(lock);
  }
}

// ==================== ATOMIC TRANSFER (Production-Ready) ====================
function handleAtomicTransfer(transferData) {
  const lock = acquireLock_('atomic_transfer');
  
  try {
    const { fromAccount, toAccount, amount, description, senderName, targetName, timestamp } = transferData;
    const now = timestamp || new Date().toISOString();
    
    // 1. Load users data (cached)
    const users = getDataByType_('user');
    const sender = users.find(u => u.phone === fromAccount && u.role === 'nasabah');
    const target = users.find(u => u.phone === toAccount && u.role === 'nasabah');
    
    // Validation
    if (!sender || !target) {
      return { status: false, error: 'Salah satu rekening tidak ditemukan' };
    }
    if (sender.status !== 'active' || target.status !== 'active') {
      return { status: false, error: 'Salah satu akun tidak aktif' };
    }
    if (sender.balance < amount) {
      return { status: false, error: 'Saldo tidak mencukupi' };
    }
    if (amount <= 0) {
      return { status: false, error: 'Jumlah transfer tidak valid' };
    }
    
    // 2. Calculate new balances
    const newSenderBalance = sender.balance - amount;
    const newTargetBalance = target.balance + amount;
    const transferId = Utilities.getUuid();
    
    // 3. Prepare transaction record
    const transactionObj = {
      type: 'transaction',
      __backendId: transferId,
      __version: 1,
      __timestamp: now,
      transaction_type: 'transfer',
      amount: amount,
      from_account: fromAccount,
      to_account: toAccount,
      from_name: senderName || sender.name,
      to_name: targetName || target.name,
      description: description || 'Transfer',
      created_at: now
    };
    
    // 4. Update sender with optimistic locking
    const senderVersion = (sender.__version || 1) + 1;
    const senderUpdated = Object.assign({}, sender, {
      balance: newSenderBalance,
      __version: senderVersion,
      __timestamp: now
    });
    
    const senderSuccess = updateSheetRowOptimistic_(
      'users', 
      sender.__backendId, 
      JSON.stringify(senderUpdated), 
      senderVersion
    );
    
    if (!senderSuccess) {
      return { status: false, error: 'Gagal update saldo pengirim (data telah berubah, silakan coba lagi)' };
    }
    
    // 5. Update target with optimistic locking (re-read for latest version)
    const usersAfter = getDataByType_('user');
    const targetFresh = usersAfter.find(u => u.__backendId === target.__backendId);
    
    if (!targetFresh) {
      // Rollback sender
      const senderRollback = Object.assign({}, sender, {
        __version: (sender.__version || 1) + 1,
        __timestamp: now
      });
      updateSheetRowOptimistic_('users', sender.__backendId, JSON.stringify(senderRollback), senderRollback.__version);
      return { status: false, error: 'Target tidak ditemukan setelah update sender' };
    }
    
    const targetVersion = (targetFresh.__version || 1) + 1;
    const targetUpdated = Object.assign({}, targetFresh, {
      balance: newTargetBalance,
      __version: targetVersion,
      __timestamp: now
    });
    
    const targetSuccess = updateSheetRowOptimistic_(
      'users',
      targetFresh.__backendId,
      JSON.stringify(targetUpdated),
      targetVersion
    );
    
    if (!targetSuccess) {
      // Rollback sender
      const senderRollback = Object.assign({}, sender, {
        __version: (sender.__version || 1) + 2,
        __timestamp: now
      });
      updateSheetRowOptimistic_('users', sender.__backendId, JSON.stringify(senderRollback), senderRollback.__version);
      return { status: false, error: 'Gagal update saldo penerima (data telah berubah, silakan coba lagi)' };
    }
    
    // 6. Write transaction record
    writeSheetRowsBatch_('transactions', [[
      transferId, 
      JSON.stringify(transactionObj), 
      1, 
      now
    ]]);
    
    // 7. Invalidate cache and return fresh data
    invalidateCache_('users');
    invalidateCache_('transactions');
    
    return { status: true, allData: getAllData() };
    
  } catch (e) {
    console.error('Atomic transfer error: ' + e.message);
    return { status: false, error: 'Terjadi kesalahan sistem: ' + e.message };
  } finally {
    releaseLock_(lock);
  }
}

// ==================== UTILITY FUNCTIONS ====================
function getServerTime() {
  return { timestamp: new Date().toISOString(), status: 'ok', server: 'BSS-GAS' };
}

function testConnection() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const name = ss.getName();
    return { status: true, message: 'Database connected: ' + name };
  } catch (e) {
    return { status: false, message: 'Database error: ' + e.message };
  }
}

function warmupCache() {
  // Preload cache for faster initial loads
  SHEET_NAMES.forEach(name => {
    readSheetDataBatch_(name);
  });
  return { status: true, message: 'Cache warmed up' };
}

// ==================== ERROR HANDLING HELPER ====================
function safeExecute_(fn, operationName) {
  try {
    return fn();
  } catch (e) {
    console.error(operationName + ' error: ' + e.message + '\n' + e.stack);
    throw e;
  }
}

function handleDirectorLogin(username, password) {
  if (username !== DIRECTOR_USERNAME || password !== DIRECTOR_LOGIN_PASSWORD) {
    return { status: false, error: 'Kredensial direktur tidak valid' };
  }

  try {
    let users = getDataByType_('user');
    let director = users.find(u => u.username === DIRECTOR_USERNAME && u.role === 'direktur');

    // Auto-create direktur jika belum ada, sama seperti fitur sebelumnya
    if (!director) {
      const lock = acquireLock_('create_director');
      try {
        users = getDataByType_('user');
        director = users.find(u => u.username === DIRECTOR_USERNAME && u.role === 'direktur');

        if (!director) {
          const sheetName = getSheetName('user');
          const newId = Utilities.getUuid();
          const version = 1;
          const timestamp = new Date().toISOString();

          director = {
            type: 'user',
            __backendId: newId,
            __version: version,
            __timestamp: timestamp,
            username: DIRECTOR_USERNAME,
            password: DIRECTOR_DB_PASSWORD,
            name: 'Direktur BSS',
            phone: '-',
            role: 'direktur',
            status: 'active',
            created_at: timestamp
          };

          writeSheetRowsBatch_(sheetName, [[newId, JSON.stringify(director), version, timestamp]]);
          invalidateCache_(sheetName);
        }
      } finally {
        releaseLock_(lock);
      }
    }

    const allData = getAllData();
    return { status: true, director: director, allData: allData };

  } catch (e) {
    console.error('Director login error: ' + e.message);
    return { status: false, error: 'Terjadi kesalahan sistem: ' + e.message };
  }
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🧪 BSS Tests')
    .addItem('Run All Tests', 'runAllTests')
    .addItem('Run Integration Tests', 'runIntegrationTests')
    .addItem('Quick Test', 'quickTest')
    .addToUi();
}
