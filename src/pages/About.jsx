// src/pages/About.jsx
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Tentang Aplikasi Insider</h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            <strong>Insider</strong> adalah aplikasi dashboard yang digunakan oleh PT Telkom Infrastruktur Indonesia
            untuk melihat dan menganalisis data penyedia layanan internet (ISP) di seluruh Indonesia. Aplikasi ini
            memudahkan pengguna dalam melakukan monitoring, pengambilan keputusan, dan ekspor data secara efisien.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Apa yang Bisa Dilakukan?</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Lihat peta interaktif sebaran ISP</li>
              <li>Filter dan analisis data ISP</li>
              <li>Akses grafik dan laporan</li>
              <li>Ekspor data ke Excel</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Siapa yang Bisa Menggunakan?</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Pengguna Umum:</strong> Melihat informasi dan data ISP</li>
              <li><strong>Admin:</strong> Mengelola pengguna & sistem</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Tujuan Aplikasi</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Memudahkan monitoring ISP</li>
              <li>Mempercepat analisis pasar ISP</li>
              <li>Mendukung strategi bisnis</li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Nilai Tambah</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Data mudah dipahami & diakses</li>
              <li>Pengambilan keputusan lebih akurat</li>
              <li>Efisiensi operasional meningkat</li>
            </ul>
          </div>
        </div>

        <p className="mt-10 text-sm text-gray-500 italic text-center">
          Insider membantu memperkuat efisiensi kerja dan transformasi digital di PT Telkom Infrastruktur Indonesia.
        </p>
      </div>
    </div>
  );
};

export default About;
