/* Dashboard MPP – merender halaman dari DATA (lihat data.js). Statis, tanpa database.
   Pilih satu tanggal -> hanya data tanggal itu yang tampil (tidak ada total gabungan). */
   (() => {
    const HARI  = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
    const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
                   'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
    const $   = (id) => document.getElementById(id);
    const pad = (n) => String(n).padStart(2, '0');
    const nf  = (n, d = 0) => n.toLocaleString('id-ID', { minimumFractionDigits: d, maximumFractionDigits: d });
    const pct = (n, total) => (n && total ? nf((n / total) * 100, 1) + '%' : '0%');
  
    const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
    const tglPanjang = (s) => { const t = parse(s); return `${HARI[t.getDay()]}, ${t.getDate()} ${BULAN[t.getMonth()]} ${t.getFullYear()}`; };
  
    // Uang: pilih satuan otomatis (Jt / M / T), 3 angka desimal
    const uang = (n) => {
      const [div, unit] = n >= 1e12 ? [1e12, 'T'] : n >= 1e9 ? [1e9, 'M'] : [1e6, 'Jt'];
      return { num: nf(n / div, 3), unit };
    };
    const rpHtml = (n) => { const u = uang(n); return `Rp ${u.num} <small>${u.unit}</small>`; };
    const rpText = (n) => { const u = uang(n); return `Rp ${u.num} ${u.unit}`; };
  
    // Total per hari (hanya untuk satu hari, bukan gabungan antar hari)
    const totalIzin       = (r) => r.izin.nib + r.izin.pbg + r.izin.kesehatan + r.izin.lainnya;
    const totalPengunjung = (r) => Object.values(r.pengunjung).reduce((a, b) => a + b, 0);
  
    // Data: urut berdasarkan tanggal
    const rows = [...DATA].sort((a, b) => a.date.localeCompare(b.date));
    if (!rows.length) { $('detail-title').textContent = 'Belum ada data'; return; }
    const byDate = Object.fromEntries(rows.map((r) => [r.date, r]));
    const first = rows[0];
    const last  = rows[rows.length - 1];
  
    // Rentang pemilih tanggal: tanggal 1 pada bulan data pertama s.d. data terakhir
    const minDate = first.date.slice(0, 8) + '01';
    const maxDate = last.date;
  
    // Grafik batang: tanggal 1 s.d. data terakhir pada bulan data terakhir
    const [Y, MO, DEND] = last.date.split('-').map(Number);
    const prefix = `${Y}-${pad(MO)}-`;
    const inMonth = rows.filter((r) => r.date.startsWith(prefix));
  
    let selected = last.date;   // tanggal yang dipilih (boleh belum ada datanya)
    let metric = 'izin';
  
    // ---------- Pemilih tanggal ----------
    function renderPicker() {
      const ada = !!byDate[selected];
      const input = $('tgl-input');
      input.min = minDate;
      input.max = maxDate;
      input.value = selected;
  
      $('periode').textContent = tglPanjang(selected);
      $('detail').hidden = !ada;
  
      const note = $('tgl-note');
      note.hidden = ada;
      note.textContent = ada ? '' : `Belum ada data untuk ${tglPanjang(selected)}. Pilih tanggal lain atau pakai tombol ‹ ›.`;
  
      const prev = [...rows].reverse().find((r) => r.date < selected);
      const next = rows.find((r) => r.date > selected);
      $('tgl-prev').disabled = !prev; $('tgl-prev').dataset.date = prev ? prev.date : '';
      $('tgl-next').disabled = !next; $('tgl-next').dataset.date = next ? next.date : '';
    }
  
    // ---------- Grafik harian (juga bisa dipakai memilih tanggal) ----------
    function renderChart() {
      const val = metric === 'izin' ? totalIzin : totalPengunjung;
      const unit = metric === 'izin' ? 'izin' : 'pengunjung';
      const max = Math.max(1, ...inMonth.map(val));
      $('chart-title').textContent = metric === 'izin' ? 'Izin terbit per hari' : 'Pengunjung per hari';
  
      let html = '';
      for (let d = 1; d <= DEND; d++) {
        const iso = prefix + pad(d);
        const r = byDate[iso];
        const dow = parse(iso).getDay();
        const weekend = dow === 0 || dow === 6;
        const v = r ? val(r) : 0;
        const h = r ? Math.max((v / max) * 78, 2) : 2;
        const label = `${tglPanjang(iso)}: ${r ? nf(v) + ' ' + unit : 'belum ada data'}`;
        html += `<button type="button" class="day${r ? '' : ' kosong'}${weekend ? ' weekend' : ''}"
            data-date="${iso}" ${r ? '' : 'disabled'} aria-pressed="${iso === selected}"
            title="${label}" aria-label="${label}">
            <span class="val">${r ? nf(v) : ''}</span>
            <span class="col" style="--h:${h}%"></span>
            <span class="num">${d}</span></button>`;
      }
      $('days').innerHTML = html;
  
      document.querySelectorAll('.tabs button').forEach((b) =>
        b.setAttribute('aria-pressed', String(b.dataset.metric === metric)));
    }
  
    // ---------- Detail satu hari ----------
    const donutBg = (segs, total) => {
      if (!total) return 'var(--line)';
      let acc = 0;
      const stops = [];
      segs.forEach((s) => {
        if (!s.n) return;
        const start = acc;
        acc += (s.n / total) * 100;
        stops.push(`${s.c} ${start.toFixed(2)}% ${acc.toFixed(2)}%`);
      });
      return `conic-gradient(${stops.join(', ')})`;
    };
    const legendItem = (c, nama, n, total) =>
      `<li><i class="sw" style="--c:${c}"></i>${nama}<span class="v">${nf(n)}</span><span class="p">${pct(n, total)}</span></li>`;
  
    function investBlock(label, inv) {
      const nilai = inv.pma.nilai + inv.pmdn.nilai;
      const a = nilai ? (inv.pma.nilai / nilai) * 100 : 0;
      const seg = (w, c, cls) => w <= 0 ? '' :
        `<i style="--w:${w.toFixed(1)}%; --c:${c}"${cls ? ` class="${cls}"` : ''}>${w >= 6 ? nf(w, 1) + '%' : ''}</i>`;
      return `
        <div class="label">${label}</div>
        <div class="total">${rpText(inv.total)}</div>
        <dl>
          <dt style="--c:var(--gold)">PMA</dt><dd>${nf(inv.pma.proyek)} Proyek</dd><dd>${rpText(inv.pma.nilai)}</dd>
          <dt style="--c:var(--green-700)">PMDN</dt><dd>${nf(inv.pmdn.proyek)} Proyek</dd><dd>${rpText(inv.pmdn.nilai)}</dd>
        </dl>
        <div class="stack" role="img" aria-label="PMA ${nf(a, 1)} persen, PMDN ${nf(100 - a, 1)} persen">
          ${seg(a, 'var(--gold)', 'dark')}${seg(100 - a, 'var(--green-700)')}
        </div>
        <div class="stack-note">Porsi nilai investasi</div>`;
    }
  
    function renderDetail() {
      const r = byDate[selected];
      const tIzin = totalIzin(r);
      const tPeng = totalPengunjung(r);
  
      $('detail-title').textContent = `Data ${tglPanjang(selected)}`;
  
      $('kpi-harian').innerHTML = `
        <div class="kpi main"><div class="label">Izin terbit</div><div class="value">${nf(tIzin)}</div></div>
        <div class="kpi"><div class="label">Pengunjung</div><div class="value">${nf(tPeng)} <small>orang</small></div></div>
        <div class="kpi"><div class="label">Retribusi</div><div class="value">${rpHtml(r.retribusi.hari)}</div></div>
        <div class="kpi"><div class="label">Tenaga kerja terserap</div><div class="value">${nf(r.tenagaKerja.hari)} <small>orang</small></div></div>
        <div class="kpi"><div class="label">Potensi investasi</div><div class="value">${rpHtml(r.investasi.hari.total)}</div></div>`;
  
      // Komposisi izin
      const iz = [
        { nama: 'NIB',            n: r.izin.nib,       c: 'var(--green-900)' },
        { nama: 'PBG',            n: r.izin.pbg,       c: 'var(--gold)' },
        { nama: 'Lainnya',        n: r.izin.lainnya,   c: 'var(--green-500)' },
        { nama: 'Izin Kesehatan', n: r.izin.kesehatan, c: 'var(--green-300)' }
      ];
      $('izin-donut').style.background = donutBg(iz, tIzin);
      $('izin-donut').setAttribute('aria-label',
        `Komposisi ${tIzin} izin: ` + iz.map((s) => `${s.nama} ${s.n}`).join(', '));
      $('izin-total').textContent = nf(tIzin);
      $('izin-legend').innerHTML = iz.map((s) => legendItem(s.c, s.nama, s.n, tIzin)).join('');
  
      // Retribusi & tenaga kerja
      $('retribusi-hari').innerHTML = rpHtml(r.retribusi.hari);
      $('retribusi-ytd').innerHTML  = rpHtml(r.retribusi.ytd);
      $('naker-hari').innerHTML     = `${nf(r.tenagaKerja.hari)} <small>orang</small>`;
      $('naker-ytd').innerHTML      = `${nf(r.tenagaKerja.ytd)} <small>orang</small>`;
  
      // Investasi
      $('inv-hari').innerHTML = investBlock('Harian', r.investasi.hari);
      $('inv-ytd').innerHTML  = investBlock('Januari s.d. tanggal ini', r.investasi.ytd);
  
      // Pengunjung: urut dari terbanyak (urutan registry dipakai jika sama)
      Object.keys(r.pengunjung).forEach((k) => { if (!INSTANSI[k]) console.warn('Instansi tidak dikenal di data.js:', k); });
      const list = Object.keys(INSTANSI)
        .map((k) => ({ ...INSTANSI[k], n: r.pengunjung[k] || 0 }))
        .filter((x) => x.n > 0)
        .sort((a, b) => b.n - a.n);
  
      const warna = ['var(--green-900)', 'var(--green-700)', 'var(--green-500)',
                     'var(--green-300)', 'var(--gold)', 'var(--gold-soft)'];
      const top = list.slice(0, 6).map((x, i) => ({ nama: x.nama, n: x.n, c: warna[i] }));
      const rest = list.slice(6);
      if (rest.length === 1) top.push({ nama: rest[0].nama, n: rest[0].n, c: 'var(--line)' });
      else if (rest.length > 1) top.push({ nama: `Lainnya (${rest.length} instansi)`, n: rest.reduce((a, x) => a + x.n, 0), c: 'var(--line)' });
  
      $('pengunjung-donut').style.background = donutBg(top, tPeng);
      $('pengunjung-donut').setAttribute('aria-label',
        `Porsi ${tPeng} pengunjung: ` + top.map((s) => `${s.nama} ${pct(s.n, tPeng)}`).join(', '));
      $('pengunjung-total').textContent = nf(tPeng);
      $('pengunjung-legend').innerHTML = top.map((s) => legendItem(s.c, s.nama, s.n, tPeng)).join('');
  
      const maxN = list.length ? list[0].n : 1;
      $('pengunjung-list').innerHTML = list.map((x) => `
        <li><span class="logo"><img src="${x.logo}" alt="${x.nama}"></span>
          <span class="name">${x.nama}${x.sub ? `<small>${x.sub}</small>` : ''}</span>
          <span class="count">${nf(x.n)}</span>
          <span class="bar"><i style="--w:${((x.n / maxN) * 100).toFixed(1)}%"></i></span></li>`).join('');
    }
  
    // ---------- Interaksi ----------
    function render() {
      renderPicker();
      renderChart();
      if (byDate[selected]) renderDetail();
    }
  
    function pilih(iso) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return;
      selected = iso;
      // tautan bisa dibagikan per tanggal; replaceState bisa ditolak di file://, jadi ada cadangan
      try { history.replaceState(null, '', '#' + iso); } catch (e) { location.hash = iso; }
      render();
    }
  
    $('tgl-input').addEventListener('change', (e) => { if (e.target.value) pilih(e.target.value); });
    ['tgl-prev', 'tgl-next'].forEach((id) =>
      $(id).addEventListener('click', (e) => { if (e.currentTarget.dataset.date) pilih(e.currentTarget.dataset.date); }));
  
    $('days').addEventListener('click', (e) => {
      const b = e.target.closest('.day');
      if (b && !b.disabled) pilih(b.dataset.date);
    });
    document.querySelector('.tabs').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      metric = b.dataset.metric;
      renderChart();
    });
    window.addEventListener('hashchange', () => {
      const h = location.hash.slice(1);
      if (byDate[h] && h !== selected) pilih(h);
    });
  
    // ---------- Mulai ----------
    const awal = location.hash.slice(1);
    if (byDate[awal]) selected = awal;
    render();
  })();