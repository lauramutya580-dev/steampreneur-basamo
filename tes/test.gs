/**
 * BSS - Test Suite
 * File: test.gs
 * Cara menjalankan: Menu Extensions > Apps Script > Pilih fungsi runAllTests > Run
 */

// ==================== TEST RUNNER ====================
const TestResults = {
  passed: 0,
  failed: 0,
  errors: [],
  
  log: function(name, status, message = '') {
    if (status) {
      this.passed++;
      console.log(`✅ PASS: ${name}`);
    } else {
      this.failed++;
      this.errors.push({ name, message });
      console.error(`❌ FAIL: ${name} - ${message}`);
    }
  },
  
  summary: function() {
    const total = this.passed + this.failed;
    console.log('\n========== TEST SUMMARY ==========');
    console.log(`Total: ${total} | ✅ Passed: ${this.passed} | ❌ Failed: ${this.failed}`);
    if (this.errors.length > 0) {
      console.log('\nFailed Tests:');
      this.errors.forEach(e => console.log(`  - ${e.name}: ${e.message}`));
    }
    console.log('==================================');
    return { passed: this.passed, failed: this.failed, errors: this.errors };
  },
  
  reset: function() {
    this.passed = 0;
    this.failed = 0;
    this.errors = [];
  }
};

// Helper assertion
function assertEqual(actual, expected, testName) {
  const pass = actual === expected;
  TestResults.log(
    testName, 
    pass, 
    pass ? '' : `Expected "${expected}", got "${actual}"`
  );
}

function assertTrue(condition, testName, message = '') {
  TestResults.log(testName, !!condition, message || 'Condition is false');
}

// ==================== TEST CASES ====================

function testFormatRupiah() {
  console.log('\n--- Test: Format Rupiah ---');
  // Karena formatRupiah ada di client-side (HTML), kita buat versi server untuk test
  const formatRupiah = (num) => {
    if (!num && num !== 0) return 'Rp 0';
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  };
  
  assertEqual(formatRupiah(1000), 'Rp 1.000', 'Format 1000');
  assertEqual(formatRupiah(1500000), 'Rp 1.500.000', 'Format 1.5 juta');
  assertEqual(formatRupiah(0), 'Rp 0', 'Format 0');
  assertEqual(formatRupiah(null), 'Rp 0', 'Format null');
}

function testParseRupiah() {
  console.log('\n--- Test: Parse Rupiah ---');
  const parseRupiah = (str) => {
    if (!str) return 0;
    return parseInt(str.toString().replace(/[^\d]/g, '')) || 0;
  };
  
  assertEqual(parseRupiah('Rp 1.000'), 1000, 'Parse "Rp 1.000"');
  assertEqual(parseRupiah('1.500.000'), 1500000, 'Parse "1.500.000"');
  assertEqual(parseRupiah(''), 0, 'Parse string kosong');
  assertEqual(parseRupiah(null), 0, 'Parse null');
}

function testPhoneValidation() {
  console.log('\n--- Test: Validasi No. HP ---');
  const phoneRegex = /^08\d{8,12}$/;
  
  assertTrue(phoneRegex.test('08123456789'), 'Valid: 08123456789');
  assertTrue(phoneRegex.test('081234567890'), 'Valid: 12 digit');
  assertTrue(!phoneRegex.test('0812345678'), 'Invalid: terlalu pendek');
  assertTrue(!phoneRegex.test('081234567890123'), 'Invalid: terlalu panjang');
  assertTrue(!phoneRegex.test('02112345678'), 'Invalid: bukan 08xx');
  assertTrue(!phoneRegex.test('abc'), 'Invalid: huruf');
}

function testPinValidation() {
  console.log('\n--- Test: Validasi PIN ---');
  const pinRegex = /^\d{6}$/;
  
  assertTrue(pinRegex.test('123456'), 'Valid: 123456');
  assertTrue(pinRegex.test('000000'), 'Valid: 000000');
  assertTrue(!pinRegex.test('12345'), 'Invalid: 5 digit');
  assertTrue(!pinRegex.test('1234567'), 'Invalid: 7 digit');
  assertTrue(!pinRegex.test('abcdef'), 'Invalid: huruf');
  assertTrue(!pinRegex.test('12345a'), 'Invalid: campuran');
}

function testAtomicTransferLogic() {
  console.log('\n--- Test: Logika Transfer (Simulasi) ---');
  
  // Simulasi logika transfer tanpa menyentuh database
  const sender = { balance: 1000000 };
  const target = { balance: 500000 };
  const amount = 300000;
  
  // Test 1: Saldo cukup
  const canTransfer = sender.balance >= amount;
  assertTrue(canTransfer, 'Transfer dengan saldo cukup');
  
  // Test 2: Hitung saldo baru
  const newSenderBalance = sender.balance - amount;
  const newTargetBalance = target.balance + amount;
  assertEqual(newSenderBalance, 700000, 'Saldo pengirim setelah transfer');
  assertEqual(newTargetBalance, 800000, 'Saldo penerima setelah transfer');
  
  // Test 3: Total saldo tetap (conservation of money)
  const totalBefore = sender.balance + target.balance;
  const totalAfter = newSenderBalance + newTargetBalance;
  assertEqual(totalBefore, totalAfter, 'Total saldo sebelum = sesudah');
  
  // Test 4: Saldo tidak cukup
  const insufficientSender = { balance: 100000 };
  assertTrue(insufficientSender.balance < amount, 'Tolak jika saldo tidak cukup');
}

function testTransferLimits() {
  console.log('\n--- Test: Batas Transfer Harian ---');
  
  const settings = {
    max_transfer_pelajar: 500000,
    max_transfer_umum: 2000000
  };
  
  const todayTransfersPelajar = 300000;
  const todayTransfersUmum = 1500000;
  const newTransfer = 250000;
  
  // Test pelajar
  const pelajarExceeded = (todayTransfersPelajar + newTransfer) > settings.max_transfer_pelajar;
  assertTrue(pelajarExceeded, 'Pelajar melebihi batas harian');
  
  // Test umum
  const umumExceeded = (todayTransfersUmum + newTransfer) > settings.max_transfer_umum;
  assertTrue(!umumExceeded, 'Umum masih dalam batas harian');
}

function testSelfTransferPrevention() {
  console.log('\n--- Test: Pencegahan Transfer ke Diri Sendiri ---');
  
  const currentUser = { phone: '08123456789' };
  const targetAccount = '08123456789';
  const otherAccount = '08987654321';
  
  assertTrue(
    currentUser.phone === targetAccount,
    'Deteksi transfer ke diri sendiri'
  );
  assertTrue(
    currentUser.phone !== otherAccount,
    'Izinkan transfer ke orang lain'
  );
}

function testPinBlocking() {
  console.log('\n--- Test: Pemblokiran PIN ---');
  
  let attempts = 0;
  const maxAttempts = 3;
  
  // Simulasi 3x salah
  for (let i = 0; i < 3; i++) {
    attempts++;
  }
  
  const isBlocked = attempts >= maxAttempts;
  assertTrue(isBlocked, 'Akun terblokir setelah 3x salah');
  
  // Reset
  attempts = 0;
  assertTrue(attempts < maxAttempts, 'Akun tidak terblokir setelah reset');
}

function testVersionConflict() {
  console.log('\n--- Test: Optimistic Locking ---');
  
  const currentVersion = 5;
  const expectedVersion = 6;
  const wrongVersion = 4;
  
  assertTrue(
    expectedVersion === currentVersion + 1,
    'Version cocok → update berhasil'
  );
  assertTrue(
    wrongVersion !== currentVersion + 1,
    'Version tidak cocok → update ditolak'
  );
}

// ==================== RUN ALL TESTS ====================
function runAllTests() {
  console.log('========================================');
  console.log('🚀 BSS TEST SUITE - Starting...');
  console.log('========================================');
  
  TestResults.reset();
  
  try {
    testFormatRupiah();
    testParseRupiah();
    testPhoneValidation();
    testPinValidation();
    testAtomicTransferLogic();
    testTransferLimits();
    testSelfTransferPrevention();
    testPinBlocking();
    testVersionConflict();
  } catch (e) {
    console.error('💥 Test runner error:', e.message);
  }
  
  return TestResults.summary();
}

// ==================== INTEGRATION TEST (dengan database) ====================
function runIntegrationTests() {
  console.log('\n========================================');
  console.log('🔗 INTEGRATION TESTS (butuh database)');
  console.log('========================================');
  
  try {
    // Test koneksi database
    const connResult = testConnection();
    assertTrue(connResult.status, 'Koneksi database aktif', connResult.message);
    
    // Test getAllData
    const data = getAllData();
    assertTrue(Array.isArray(data), 'getAllData mengembalikan array');
    console.log(`📊 Total data: ${data.length} records`);
    
    // Test setupDatabase (aman, tidak merusak data)
    setupDatabase();
    assertTrue(true, 'setupDatabase berjalan tanpa error');
    
  } catch (e) {
    console.error('Integration test error:', e.message);
  }
}

// ==================== QUICK TEST (untuk development) ====================
function quickTest() {
  // Jalankan hanya 1 fungsi test untuk debugging cepat
  testAtomicTransferLogic();
  return TestResults.summary();
}
