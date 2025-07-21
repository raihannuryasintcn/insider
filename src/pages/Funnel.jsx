import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BarChart3, Search, Plus, Upload, X, File, CheckCircle, TrendingUp, Users, Calendar, Target } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import funnelData from './funnel.json'; // Assuming you have a JSON file with funnel data


const defaultFunnelStructure = {
  'Pre-Sales': ['F0', 'F1', 'F2', 'F3'],
  'Sales': ['F4', 'F5'],
  'Delivery': ['Delivery'],
  'After-Sales': ['BillCo', 'Assurance'],
};

const stageColors = {
  'Pre-Sales': 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150',
  'Sales': 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-150',
  'Delivery': 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-150',
  'After-Sales': 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150',
};

const stageIcons = {
  'Pre-Sales': Target,
  'Sales': TrendingUp,
  'Delivery': Users,
  'After-Sales': Calendar,
};

const createDefaultFunnelData = () => {
  const stageData = {
    F0: { count: 82, title: 'Lead' },
    F1: { count: 72, title: 'Opportunity' },
    F2: { count: 24, title: 'Feasibility Study' },
    F3: { count: 15, title: 'Project Assesment' },
    F4: { count: 26, title: 'Agreement' },
    F5: { count: 30, title: 'Order Fulfillment' },
    Delivery: { count: 0, title: 'Delivery' },
    BillCo: { count: 0, title: 'BillCo' },
    Assurance: { count: 0, title: 'Assurance' }
  };

  return Object.entries(defaultFunnelStructure).map(([stage, ids]) => ({
    stage,
    items: ids.map((id) => ({
      id,
      title: stageData[id].title,
      count: stageData[id].count,
      subtitle: 'Click to view ISP details and analytics',
    })),
  }));
};

export default function CompactISPFunnel() {
  const [funnelData, setFunnelData] = useState(createDefaultFunnelData());
  const [totalFunnel, setTotalFunnel] = useState(249); // Total dari semua stage
  const [selectedStage, setSelectedStage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const sampleISPData = [
    // { no: 1, namaISP: 'ConnectNet Solutions', layanan: 'Fiber Premium', fyRev: '485M', territory: 'Jakarta Pusat', am: 'Andi Wijaya', notes: 'Strategic partnership discussions ongoing' },
    // { no: 2, namaISP: 'GlobalLink Communications', layanan: 'Wireless Enterprise', fyRev: '392M', territory: 'Surabaya', am: 'Sinta Dewi', notes: 'Expansion to 5 new cities planned' },
    // { no: 3, namaISP: 'MetroNet Indonesia', layanan: 'Cloud Connect', fyRev: '347M', territory: 'Bandung', am: 'Rudi Hartono', notes: 'Technical evaluation phase completed' },
    // { no: 4, namaISP: 'VelocityNet Corp', layanan: 'Dedicated Internet', fyRev: '298M', territory: 'Medan', am: 'Lisa Pratiwi', notes: 'Contract terms under review' },
    // { no: 5, namaISP: 'DataStream Networks', layanan: 'MPLS Premium', fyRev: '256M', territory: 'Makassar', am: 'Budi Setiawan', notes: 'Pilot deployment successful' },
    // { no: 6, namaISP: 'SpeedLink Technologies', layanan: 'Metro Ethernet', fyRev: '234M', territory: 'Semarang', am: 'Maya Sari', notes: 'Infrastructure integration in progress' },
    // { no: 7, namaISP: 'UltraConnect ISP', layanan: 'Satellite Backup', fyRev: '198M', territory: 'Balikpapan', am: 'Agus Prasetyo', notes: 'Service level agreements finalized' },
    // { no: 8, namaISP: 'TechnoNet Services', layanan: 'Hybrid Network', fyRev: '167M', territory: 'Palembang', am: 'Dewi Anggraini', notes: 'Monthly performance review scheduled' },
    // { no: 9, namaISP: 'NextGen Broadband', layanan: 'SD-WAN Solution', fyRev: '145M', territory: 'Denpasar', am: 'Hendra Kusuma', notes: 'Customer satisfaction survey completed' },
    // { no: 10, namaISP: 'DigiLink Networks', layanan: 'IoT Connectivity', fyRev: '123M', territory: 'Yogyakarta', am: 'Ratna Wulan', notes: 'Ongoing support and maintenance' },
    // { no: 11, namaISP: 'CloudStream ISP', layanan: 'Virtual Private Network', fyRev: '109M', territory: 'Malang', am: 'Doni Setiawan', notes: 'Security audit in progress' },
    // { no: 12, namaISP: 'FiberMax Solutions', layanan: 'Enterprise Hosting', fyRev: '87M', territory: 'Solo', am: 'Fitri Handayani', notes: 'Quarterly business review due' }
  ];
  useEffect(() => {
    // Simulasi loading data - dalam implementasi nyata akan fetch dari API
    const fetchFunnelData = async () => {
      try {
        // Simulasi delay loading
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Data sudah di-set dari createDefaultFunnelData()
        console.log('✅ Funnel data loaded successfully');
      } catch (err) {
        console.error('❌ Failed to fetch data, using default data', err);
      }
    };

    fetchFunnelData();
  }, []);

  const handleCardClick = (item) => {
    setSelectedStage(item);
    setIsModalOpen(true);
    setSearchTerm('');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    if (e.target.files?.length) handleFiles(e.target.files);
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      file,
      name: file.name,
      size: file.size,
      id: Date.now() + Math.random(),
      status: 'ready',
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const uploadFiles = async () => {
    if (!uploadedFiles.length) return;
    setIsUploading(true);
    const url = 'http://10.212.1.212:4444/upload-excel';

    const results = await Promise.all(
      uploadedFiles.map(async (item) => {
        const formData = new FormData();
        formData.append('file', item.file);

        try {
          const res = await fetch(url, { method: 'POST', body: formData });
          return { ...item, status: res.ok ? 'success' : 'error' };
        } catch (err) {
          return { ...item, status: 'error', error: err.message };
        }
      })
    );

    setUploadedFiles(results);
    setTimeout(() => setIsUploadModalOpen(false), 2000);
    setIsUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const filteredData = sampleISPData.filter(
    (item) =>
      item.namaISP.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.layanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.territory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.am.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto p-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div className="ml-6">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Overview Status Funnel</p>
              <h1 className="text-4xl font-bold text-gray-900 mt-1">{totalFunnel.toLocaleString()}</h1>
              <p className="text-sm text-gray-600 mt-1">Total</p>
            </div>
          </div>
          <div className='flex flex-col gap-2 items-center'>
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
              <Plus className="mr-2 h-4 w-4" />
              Upload New Data
            </Button>
              <label> last updated: 6 Juni</label>
          </div>
        </div>
      </div>

      {/* Funnel Stages */}
      {funnelData.map((stage) => {
        const StageIcon = stageIcons[stage.stage];
        return (
          <div key={stage.stage} className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <StageIcon className="h-6 w-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">{stage.stage}</h2>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {stage.items.reduce((sum, item) => sum + item.count, 0)} total
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stage.items.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${stageColors[stage.stage]}`}
                  onClick={() => handleCardClick(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-600 mb-1">{item.id}</div>
                        <div className="text-lg font-medium text-gray-800 leading-tight">{item.title}</div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 ml-4">{item.count}</div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.subtitle}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}

      {/* Enhanced ISP Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              {selectedStage?.id} - {selectedStage?.title}
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full ml-auto">
                {selectedStage?.count} opportunities
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by ISP name, service type, territory, or account manager..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-base border-2 focus:border-blue-500 rounded-lg"
            />
          </div>

          <div className="overflow-auto max-h-96 rounded-lg border">
            <table className="w-full border-collapse bg-white">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">ISP Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Service Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">FY Revenue</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Territory</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Account Manager</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr key={row.no} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{row.no}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-blue-600">{row.namaISP}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {row.layanan}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">IDR {row.fyRev}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{row.territory}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{row.am}</td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate" title={row.notes}>
                        {row.notes}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Search className="h-12 w-12 text-gray-300" />
                        <p className="text-gray-500 text-lg">No matching records found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              Upload ISP Data Files
            </DialogTitle>
            <p className="text-gray-600 mt-2">Upload Excel or CSV files containing ISP funnel data to update the dashboard</p>
          </DialogHeader>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-8 rounded-xl text-center transition-all duration-200 ${dragActive
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">Drop your files here</p>
                <p className="text-gray-500 text-sm mt-1">Or click below to browse from your computer</p>
              </div>
              <Button
                variant="outline"
                className="mt-2 border-2 hover:border-blue-500 hover:text-blue-600"
                onClick={() => fileInputRef.current?.click()}
              >
                <File className="mr-2 h-4 w-4" />
                Browse Files
              </Button>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                <span className="bg-gray-100 px-2 py-1 rounded">Excel (.xlsx, .xls)</span>
                <span className="bg-gray-100 px-2 py-1 rounded">CSV (.csv)</span>
                <span className="text-gray-400">•</span>
                <span>Max 10MB per file</span>
              </div>
            </div>
          </div>

          <input
            type="file"
            multiple
            ref={fileInputRef}
            accept=".xlsx,.xls,.csv"
            onChange={handleChange}
            className="hidden"
          />

          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-800 mb-3">Selected Files ({uploadedFiles.length})</h4>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex justify-between items-center bg-white p-3 rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <File className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{file.name}</div>
                      <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {file.status === 'uploading' && (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                        <span className="text-xs text-blue-600">Uploading...</span>
                      </div>
                    )}
                    {file.status === 'success' && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">Success</span>
                      </div>
                    )}
                    {file.status === 'error' && (
                      <div className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-500" />
                        <span className="text-xs text-red-600">Failed</span>
                      </div>
                    )}
                    {file.status === 'ready' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setUploadedFiles(prev => prev.filter(f => f.id !== file.id))}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
              disabled={isUploading}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={uploadFiles}
              disabled={!uploadedFiles.length || isUploading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Uploading Files...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload {uploadedFiles.length} File{uploadedFiles.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}