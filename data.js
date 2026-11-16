/* =====================================================================
   DATA DASHBOARD  (satu-satunya file yang diedit tiap hari)
   ---------------------------------------------------------------------
   Cara menambah data hari baru:
   1. Salin satu blok { date: ... } di bawah, tempel di akhir DATA.
   2. Ganti tanggal dan angkanya sesuai poster hari itu.
   3. Simpan, lalu refresh halaman. Total, persen, dan grafik dihitung otomatis.

   Satuan uang ditulis seperti di poster:
     3.206 * JT   -> "Rp 3,206 Jt"
     10.769 * M   -> "Rp 10,769 M"
     13.272 * T   -> "Rp 13,272 T"
   ===================================================================== */

   const JT = 1e6;   // juta
   const M  = 1e9;   // miliar
   const T  = 1e12;  // triliun
   
   /* Daftar instansi. Urutan di sini dipakai kalau jumlah pengunjung sama.
      Kunci (disdukcapil, polda, ...) dipakai di bagian `pengunjung` di bawah. */
   const INSTANSI = {
     disdukcapil: { nama: 'Disdukcapil',          sub: 'Kota Pekanbaru',                    logo: 'logos/disdukcapil.png' },
     polda:       { nama: 'Polda',                sub: 'Riau',                              logo: 'logos/polda.png' },
     bpjs:        { nama: 'BPJS Kesehatan',       sub: '',                                  logo: 'logos/bpjs.webp' },
     dpm:         { nama: 'DPMPTSP',              sub: 'Kota Pekanbaru',                    logo: 'logos/dpm.png' },
     bri:         { nama: 'BRI',                  sub: 'Bank Rakyat Indonesia',             logo: 'logos/bri.webp' },
     samsat:      { nama: 'Samsat',               sub: 'Bapenda Prov. Riau – Jasa Raharja', logo: 'logos/samsat.png' },
     imi:         { nama: 'Imigrasi',             sub: 'Kelas I TPI Pekanbaru',             logo: 'logos/imi.png' },
     dlhk:        { nama: 'DLHK',                 sub: 'Kota Pekanbaru',                    logo: 'logos/dlhk.png' },
     djp:         { nama: 'DJP',                  sub: 'Direktorat Jenderal Pajak',         logo: 'logos/djp.png' },
     pupr:        { nama: 'Dinas PUPR',           sub: 'Kota Pekanbaru',                    logo: 'logos/pupr.png' },
     bapenda:     { nama: 'Bapenda',              sub: 'Kota Pekanbaru',                    logo: 'logos/bapenda.png' },
     bpn:         { nama: 'BPN',                  sub: 'Kota Pekanbaru',                    logo: 'logos/bpn.png' },
     lpse:        { nama: 'LPSE',                 sub: 'Kota Pekanbaru',                    logo: 'logos/lpse.png' },
     dinkes:      { nama: 'Dinkes',               sub: 'Kota Pekanbaru',                    logo: 'logos/dinkes.png' },
     brk:         { nama: 'BRK',                  sub: 'Syariah',                           logo: 'logos/brk.png' },
     bpjstk:      { nama: 'BPJS Ketenagakerjaan', sub: '',                                  logo: 'logos/bpjstk.webp' },
     dishub:      { nama: 'Dishub',               sub: 'Kota Pekanbaru',                    logo: 'logos/dishub.png' },
     disperkim:   { nama: 'Disperkim',            sub: 'Kota Pekanbaru',                    logo: 'logos/disperkim.png' },
     disdik:      { nama: 'Disdik',               sub: 'Kota pekanbaru',                    logo: 'logos/disdik.jpg' },
     bpjph:       { nama: 'BPJPH',                sub: 'Provinsi Riau',                     logo: 'logos/bpjph.svg' },
   };
   
   const DATA = [
     {
       date: '2026-11-13',                                   // format: tahun-bulan-tanggal
       izin: { nib: 70, pbg: 2, kesehatan: 0, lainnya: 7 },  // jumlah izin terbit = total keempatnya
       retribusi: { hari: 3.206 * JT, ytd: 10.769 * M },     // ytd = "Januari s.d. sekarang"
       tenagaKerja: { hari: 5, ytd: 4429 },
       investasi: {
         hari: {
           total: 34.704 * M,
           pma:  { proyek: 1,   nilai: 12.03 * M },
           pmdn: { proyek: 169, nilai: 22.67 * M }
         },
         ytd: {
           total: 13.272 * T,
           pma:  { proyek: 126,   nilai: 2.302 * T },
           pmdn: { proyek: 37164, nilai: 10.970 * T }
         }
       },
       pengunjung: {   // jumlah per instansi; yang tidak ada hari itu boleh dihapus
         disdukcapil: 331, polda: 55, bpjs: 45, dpm: 41, bri: 31, samsat: 27,
         imi: 11, dlhk: 9, djp: 9, pupr: 9, bapenda: 6, bpn: 5,
         lpse: 1, dinkes: 1, brk: 1, bpjstk: 1, dishub: 1
       }
     },
     {
        date: '2026-11-02',                                   
        izin: { nib: 99, pbg: 3, kesehatan: 34, lainnya: 0 },
        retribusi: { hari: 139.813 * JT, ytd: 10.325 * M },
        tenagaKerja: { hari: 32, ytd: 4281 },
        investasi: {
          hari: {
            total: 38.508 * M,
            pma:  { proyek: 0,   nilai: 0 },
            pmdn: { proyek: 234, nilai: 38.51 * M }
          },
          ytd: {
            total: 12.762 * T,
            pma:  { proyek: 100,   nilai: 2.043 * T },
            pmdn: { proyek: 35542, nilai: 10.720 * T }
          }
        },
        pengunjung: {
          disdukcapil: 461, polda: 61, bpjs: 49, bri: 49, dpm: 44, samsat: 24,
          pupr: 14, bpn: 14, imi: 12, bapenda: 12, dlhk: 10, djp: 10, 
          disperkim: 3, brk: 2, lpse: 1, disdik: 1,
        }
      },
      {
        date: '2026-11-03',                                   
        izin: { nib: 61, pbg: 2, kesehatan: 21, lainnya: 0 },
        retribusi: { hari: 8.418 * JT, ytd: 10.334 * M },
        tenagaKerja: { hari: 19, ytd: 4298 },
        investasi: {
          hari: {
            total: 357.497 * M,
            pma:  { proyek: 4,   nilai: 2.071 * M },
            pmdn: { proyek: 150, nilai: 29.44 * M }
          },
          ytd: {
            total: 12.820 * T,
            pma:  { proyek: 104,   nilai: 2.071 * T },
            pmdn: { proyek: 35692, nilai: 10.749 * T }
          }
        },
        pengunjung: {
          disdukcapil: 420, bpjs: 57, polda: 53, bri: 38, dpm: 33, samsat: 33,
          dlhk: 11, pupr: 10, bpn: 9, bpjs: 8, imi: 7, djp: 7, 
          bapenda: 6, brk: 3, dishub: 3, dinkes: 1, lpse: 1, disperkim: 1, bpjph: 1,
        }
      },
      {
        date: '2026-11-06',                                   
        izin: { nib: 101, pbg: 0, kesehatan: 0, lainnya: 0 },
        retribusi: { hari: 0, ytd: 10.385 * M },
        tenagaKerja: { hari: 0, ytd: 4349 },
        investasi: {
          hari: {
            total: 8.095 * M,
            pma:  { proyek: 0,   nilai: 0 },
            pmdn: { proyek: 169, nilai: 8.09 * M }
          },
          ytd: {
            total: 12.900 * T,
            pma:  { proyek: 105,   nilai: 2.081 * T },
            pmdn: { proyek: 36235, nilai: 10.819 * T }
          }
        },
        pengunjung: {
          disdukcapil: 301, polda: 47, bpjs: 42, bri: 39, dpm: 37, samsat: 25,
          dlhk: 14, imi: 10, djp: 10, bpn: 7, pupr: 4, lpse: 4,
          bapenda: 2, dinkes: 2, brk: 1, dishub: 1, disperkim: 1,
        }
      },
      {
        date: '2026-11-10',                                   
        izin: { nib: 63, pbg: 1, kesehatan: 0, lainnya: 3 },
        retribusi: { hari: 66.582 *JT, ytd: 10.543 * M },
        tenagaKerja: { hari: 2, ytd: 4360 },
        investasi: {
          hari: {
            total: 63.389 * M,
            pma:  { proyek: 3,   nilai: 36.92 * M },
            pmdn: { proyek: 170, nilai: 26.47 * M }
          },
          ytd: {
            total: 13.178 * T,
            pma:  { proyek: 125,   nilai: 2.290 * T },
            pmdn: { proyek: 36623, nilai: 10.888 * T }
          }
        },
        pengunjung: {
          disdukcapil: 409, polda: 57, bpjs: 55, dpm: 41, bri: 38, samsat: 33,
          imi: 12, dlhk: 11, bpn: 11, bpjstk: 11, djp: 10, pupr: 9, 
          bapenda: 7, disperkim: 3, brk: 3, dinkes: 2, dishub: 2,  lpse: 1,
        }
      },
      {
        date: '2026-11-11',                                   
        izin: { nib: 57, pbg: 9, kesehatan: 7, lainnya: 4 },
        retribusi: { hari: 176.595 *JT, ytd: 10.719 * M },
        tenagaKerja: { hari: 7, ytd: 4406 },
        investasi: {
          hari: {
            total: 48.263 * M,
            pma:  { proyek: 0,   nilai: 48.26 * M },
            pmdn: { proyek: 209, nilai: 48.26 * M }
          },
          ytd: {
            total: 13.226 * T,
            pma:  { proyek: 125,   nilai: 2.290 * T },
            pmdn: { proyek: 36832, nilai: 10.937 * T }
          }
        },
        pengunjung: {
          disdukcapil: 358, polda: 56, bpjs: 55, dpm: 50, bri: 34, samsat: 27,
          imi: 17, dlhk: 14, bpn: 12, bapenda: 10, djp: 9, pupr: 5,
          brk: 3, dinkes: 2, lpse: 2, dishub: 1,
        }
      },
      {
        date: '2026-11-12',                                   
        izin: { nib: 44, pbg: 6, kesehatan: 24, lainnya: 2 },
        retribusi: { hari: 47.016 *JT, ytd: 10.766 * M },
        tenagaKerja: { hari: 25, ytd: 4424 },
        investasi: {
          hari: {
            total: 10.527 * M,
            pma:  { proyek: 0,   nilai: 0 },
            pmdn: { proyek: 163, nilai: 10.53 * M }
          },
          ytd: {
            total: 13.237 * T,
            pma:  { proyek: 125,   nilai: 2.290 * T },
            pmdn: { proyek: 36995, nilai: 10.847 * T }
          }
        },
        pengunjung: {
          disdukcapil: 384, polda: 57, bpjs: 50, dpm: 41, bri: 36, samsat: 30,
          bpn: 17, dlhk: 12, bapenda: 12, djp: 8, imi: 7, pupr: 7,
          bpjstk: 5, brk: 3, dinkes: 2, lpse: 1,
        }
      },
     /* , { date: '2026-11-12', ... }   <- tambahkan hari lain di sini, pisahkan dengan koma */
   ];