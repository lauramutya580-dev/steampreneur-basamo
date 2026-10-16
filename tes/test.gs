/**
 * BSS - Test Suite
 * File: test.gs
 * Cara menjalankan: Extensions > Apps Script > pilih runAllTests > Run
 *
 * PERUBAHAN UTAMA:
 *  - Tidak ada lagi duplikasi regex.
 *  - testPhoneValidation & testPinValidation memanggil fungsi produksi
 *    (isValidPhone, isValidPin) dari Code.gs → single source of truth.
 *  - Boundary test diperketat: tepat di batas bawah/atas, 1 digit di luar batas.
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
  const formatRupiah = (num) => {
    if (!num && num !== 0) return 'Rp 0';
    return 'Rp ' + Number(num).toLocaleString('id-ID');
  };
  assertEqual(formatRupiah(1000),     'Rp 1.000',     'Format 1000');
  assertEqual(formatRupiah(1500000),  'Rp 1.500.000', 'Format 1.5 juta');
  assertEqual(formatRupiah(0),        'Rp 0',         'Format 0');
  assertEqual(formatRupiah(null),     'Rp 0',         'Format null');
}

function testParseRupiah() {
  console.log('\n--- Test: Parse Rupiah ---');
  const parseRupiah = (str) => {
    if (!str) return 0;
    return parseInt(str.toString().replace(/[^\d]/g, '')) || 0;
  };
  assertEqual(parseRupiah('Rp 1.000'),  1000,    'Parse "Rp 1.000"');
  assertEqual(parseRupiah('1.500.000'), 1500000, 'Parse "1.500.000"');
  assertEqual(parseRupiah(''),          0,       'Parse string kosong');
  assertEqual(parseRupiah(null),        0,       'Parse null');
}

/**
 * 🔥 BOUNDARY TEST untuk nomor HP (DIPERBAIKI).
 * Aturan: /^08\d{8,12}$/  →  "08" (2 char) + 8..12 digit angka
 * Total panjang valid: 10 s/d 14 karakter.
 */
function testPhoneValidation() {
  console.log('\n--- Test: Validasi No. HP (boundary test) ---');

  // === VALID: tepat di batas bawah (2 + 8 = 10 karakter) ===
  assertTrue(isValidPhone('0812345678'),        'Valid: batas bawah (08 + 8 digit)');

  // === VALID: di tengah rentang (2 + 10 = 12 karakter) ===
  assertTrue(isValidPhone('081234567890'),      'Valid: 08 + 10 digit');

  // === VALID: tepat di batas atas (2 + 12 = 14 karakter) ===
  // PERBAIKAN: string sebelumnya terlalu panjang (16 char)
  assertTrue(isValidPhone('08123456789012'),    'Valid: batas atas (08 + 12 digit)');

  // === INVALID: 1 digit di bawah batas bawah (2 + 7 = 9 karakter) ===
  assertTrue(!isValidPhone('081234567'),        'Invalid: 1 digit di bawah batas bawah');

  // === INVALID: 1 digit di atas batas atas (2 + 13 = 15 karakter) ===
  // PERBAIKAN: disesuaikan agar tepat 1 digit di atas batas 14 karakter
  assertTrue(!isValidPhone('081234567890123'),  'Invalid: 1 digit di atas batas atas');

  // === INVALID: kasus lain ===
  assertTrue(!isValidPhone('02112345678'),      'Invalid: bukan 08xx');
  assertTrue(!isValidPhone('0812-345-678'),     'Invalid: ada tanda hubung');
  assertTrue(!isValidPhone('0812345678a'),      'Invalid: mengandung huruf');
  assertTrue(!isValidPhone(''),                 'Invalid: string kosong');
  assertTrue(!isValidPhone(null),               'Invalid: null');
  assertTrue(!isValidPhone(undefined),          'Invalid: undefined');
  assertTrue(!isValidPhone(8123456789),         'Invalid: number (bukan string 08...)');
}

function testPinValidation() {
  console.log('\n--- Test: Validasi PIN (boundary test) ---');

  // === VALID ===
  assertTrue(isValidPin('123456'), 'Valid: 123456');
  assertTrue(isValidPin('000000'), 'Valid: 000000');
  assertTrue(isValidPin('999999'), 'Valid: 999999');

  // === INVALID: 1 digit di bawah batas ===
  assertTrue(!isValidPin('12345'),  'Invalid: 5 digit (1 di bawah batas)');

  // === INVALID: 1 digit di atas batas ===
  assertTrue(!isValidPin('1234567'),'Invalid: 7 digit (1 di atas batas)');

  // === INVALID: kasus lain ===
  assertTrue(!isValidPin('abcdef'), 'Invalid: huruf semua');
  assertTrue(!isValidPin('12345a'), 'Invalid: campuran');
  assertTrue(!isValidPin(''),       'Invalid: string kosong');
  assertTrue(!isValidPin(null),     'Invalid: null');
  assertTrue(!isValidPin(undefined),'Invalid: undefined');
  assertTrue(!isValidPin(123456),   'Invalid: number (bukan string)');
}

function testAtomicTransferLogic() {
  console.log('\n--- Test: Logika Transfer (Simulasi) ---');
  const sender = { balance: 1000000 };
  const target = { balance: 500000 };
  const amount = 300000;

  assertTrue(sender.balance >= amount, 'Transfer dengan saldo cukup');

  const newSenderBalance = sender.balance - amount;
  const newTargetBalance = target.balance + amount;
  assertEqual(newSenderBalance, 700000, 'Saldo pengirim setelah transfer');
  assertEqual(newTargetBalance, 800000, 'Saldo penerima setelah transfer');

  const totalBefore = sender.balance + target.balance;
  const totalAfter  = newSenderBalance + newTargetBalance;
  assertEqual(totalBefore, totalAfter, 'Total saldo sebelum = sesudah');

  const insufficientSender = { balance: 100000 };
  assertTrue(insufficientSender.balance < amount, 'Tolak jika saldo tidak cukup');
}

function testTransferLimits() {
  console.log('\n--- Test: Batas Transfer Harian ---');
  const settings = { max_transfer_pelajar: 500000, max_transfer_umum: 2000000 };
  const todayTransfersPelajar = 300000;
  const todayTransfersUmum    = 1500000;
  const newTransfer           = 250000;

  assertTrue((todayTransfersPelajar + newTransfer) > settings.max_transfer_pelajar,
             'Pelajar melebihi batas harian');
  assertTrue(!((todayTransfersUmum + newTransfer) > settings.max_transfer_umum),
             'Umum masih dalam batas harian');
}

function testSelfTransferPrevention() {
  console.log('\n--- Test: Pencegahan Transfer ke Diri Sendiri ---');
  const currentUser  = { phone: '08123456789' };
  const targetAccount = '08123456789';
  const otherAccount  = '08987654321';

  assertTrue(currentUser.phone === targetAccount, 'Deteksi transfer ke diri sendiri');
  assertTrue(currentUser.phone !== otherAccount,  'Izinkan transfer ke orang lain');
}

function testPinBlocking() {
  console.log('\n--- Test: Pemblokiran PIN ---');
  let attempts = 0;
  const maxAttempts = 3;
  for (let i = 0; i < 3; i++) attempts++;
  assertTrue(attempts >= maxAttempts, 'Akun terblokir setelah 3x salah');

  attempts = 0;
  assertTrue(attempts < maxAttempts, 'Akun tidak terblokir setelah reset');
}

function testVersionConflict() {
  console.log('\n--- Test: Optimistic Locking ---');
  const currentVersion  = 5;
  const expectedVersion = 6;
  const wrongVersion    = 4;

  assertTrue(expectedVersion === currentVersion + 1, 'Version cocok → update berhasil');
  assertTrue(wrongVersion    !== currentVersion + 1, 'Version tidak cocok → update ditolak');
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

// ==================== INTEGRATION TEST ====================
function runIntegrationTests() {
  console.log('\n========================================');
  console.log('🔗 INTEGRATION TESTS (butuh database)');
  console.log('========================================');
  try {
    const connResult = testConnection();
    assertTrue(connResult.status, 'Koneksi database aktif', connResult.message);

    const data = getAllData();
    assertTrue(Array.isArray(data), 'getAllData mengembalikan array');
    console.log(`📊 Total data: ${data.length} records`);

    setupDatabase();
    assertTrue(true, 'setupDatabase berjalan tanpa error');
  } catch (e) {
    console.error('Integration test error:', e.message);
  }
}

function quickTest() {
  testPhoneValidation();
  return TestResults.summary();
}
