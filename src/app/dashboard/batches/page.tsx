'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plant, 
  ArrowLeft, 
  Plus,
  Calendar,
  Scales,
  MapPin,
  Warehouse,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  DotsThreeVertical,
  Trash,
  Check,
  X
} from '@phosphor-icons/react';

export default function BatchesListPage() {
  const router = useRouter();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [farmer, setFarmer] = useState<any>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'lost'>('all');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{batchId: string; action: 'completed' | 'lost' | 'delete'} | null>(null);

  const t = {
    bn: {
      title: 'ফসল ব্যাচ',
      addNew: 'নতুন যোগ করুন',
      back: 'ফিরে যান',
      empty: 'কোনো ফসল নেই',
      emptyDesc: 'আপনার প্রথম ফসল যোগ করুন',
      filters: {
        all: 'সব',
        active: 'সক্রিয়',
        completed: 'সম্পন্ন',
        lost: 'হারানো'
      },
      stats: {
        total: 'মোট ব্যাচ',
        active: 'সক্রিয়',
        completed: 'সম্পন্ন',
        totalWeight: 'মোট ওজন',
        kg: 'কেজি'
      },
      batch: {
        paddy: 'ধান/চাল',
        harvested: 'কাটা হয়েছে',
        weight: 'ওজন',
        storage: 'সংরক্ষণ',
        location: 'অবস্থান'
      },
      storage: {
        jute_bag: 'পাটের বস্তা',
        silo: 'সাইলো',
        open_area: 'খোলা জায়গা',
        warehouse: 'গুদামঘর',
        indoor: 'ঘরের ভিতর'
      },
      actions: {
        markCompleted: 'সম্পন্ন করুন',
        markLost: 'হারানো চিহ্নিত করুন',
        delete: 'মুছে ফেলুন',
        confirm: 'নিশ্চিত করুন',
        cancel: 'বাতিল',
        confirmCompleted: 'এই ব্যাচ সম্পন্ন হিসাবে চিহ্নিত করতে চান?',
        confirmLost: 'এই ব্যাচ হারানো হিসাবে চিহ্নিত করতে চান?',
        confirmDelete: 'এই ব্যাচ মুছে ফেলতে চান?'
      }
    },
    en: {
      title: 'Crop Batches',
      addNew: 'Add New',
      back: 'Back',
      empty: 'No batches yet',
      emptyDesc: 'Add your first crop batch',
      filters: {
        all: 'All',
        active: 'Active',
        completed: 'Completed',
        lost: 'Lost'
      },
      stats: {
        total: 'Total Batches',
        active: 'Active',
        completed: 'Completed',
        totalWeight: 'Total Weight',
        kg: 'kg'
      },
      batch: {
        paddy: 'Paddy/Rice',
        harvested: 'Harvested',
        weight: 'Weight',
        storage: 'Storage',
        location: 'Location'
      },
      storage: {
        jute_bag: 'Jute Bag Stack',
        silo: 'Silo',
        open_area: 'Open Area',
        warehouse: 'Warehouse',
        indoor: 'Indoor Storage'
      },
      actions: {
        markCompleted: 'Mark Completed',
        markLost: 'Mark as Lost',
        delete: 'Delete',
        confirm: 'Confirm',
        cancel: 'Cancel',
        confirmCompleted: 'Mark this batch as completed?',
        confirmLost: 'Mark this batch as lost?',
        confirmDelete: 'Delete this batch permanently?'
      }
    }
  };

  const text = t[lang];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { getCurrentFarmer } = await import('@/lib/auth');
      const { getFarmerBatches, getFarmerStats } = await import('@/lib/cropBatch');

      const currentFarmer = await getCurrentFarmer();
      if (!currentFarmer) {
        router.push('/login');
        return;
      }

      setFarmer(currentFarmer);
      setLang(currentFarmer.language);

      const farmerBatches = await getFarmerBatches(currentFarmer.id);
      const farmerStats = await getFarmerStats(currentFarmer.id);

      setBatches(farmerBatches);
      setStats(farmerStats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (batchId: string, status: 'completed' | 'lost') => {
    try {
      const { updateBatchStatus, getFarmerBatches, getFarmerStats } = await import('@/lib/cropBatch');
      await updateBatchStatus(batchId, status);
      
      // Reload data
      if (farmer) {
        const farmerBatches = await getFarmerBatches(farmer.id);
        const farmerStats = await getFarmerStats(farmer.id);
        setBatches(farmerBatches);
        setStats(farmerStats);
      }
      
      setConfirmAction(null);
      setMenuOpen(null);
    } catch (error) {
      console.error('Error updating batch status:', error);
    }
  };

  const handleDeleteBatch = async (batchId: string) => {
    try {
      const { deleteBatch, getFarmerBatches, getFarmerStats } = await import('@/lib/cropBatch');
      await deleteBatch(batchId);
      
      // Reload data
      if (farmer) {
        const farmerBatches = await getFarmerBatches(farmer.id);
        const farmerStats = await getFarmerStats(farmer.id);
        setBatches(farmerBatches);
        setStats(farmerStats);
      }
      
      setConfirmAction(null);
      setMenuOpen(null);
    } catch (error) {
      console.error('Error deleting batch:', error);
    }
  };

  const filteredBatches = filter === 'all' 
    ? batches 
    : batches.filter(b => b.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock size={16} weight="fill" className="text-blue-600" />;
      case 'completed':
        return <CheckCircle size={16} weight="fill" className="text-green-600" />;
      case 'lost':
        return <XCircle size={16} weight="fill" className="text-red-600" />;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft size={24} weight="bold" />
              </button>
              <div>
                <h1 className="font-bold text-lg text-gray-900">{text.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLang(prev => prev === 'bn' ? 'en' : 'bn')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-emerald-500 transition-colors text-sm font-medium"
              >
                <Globe size={14} weight="bold" />
                {lang === 'bn' ? 'EN' : 'BN'}
              </button>
              <button
                onClick={() => router.push('/dashboard/batches/new')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium shadow-lg shadow-emerald-500/20"
              >
                <Plus size={20} weight="bold" />
                <span className="hidden sm:inline">{text.addNew}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Package size={20} className="text-gray-400" weight="duotone" />
                <p className="text-sm text-gray-500">{text.stats.total}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBatches}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-blue-500" weight="duotone" />
                <p className="text-sm text-gray-500">{text.stats.active}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.activeBatches}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-500" weight="duotone" />
                <p className="text-sm text-gray-500">{text.stats.completed}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedBatches}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Scales size={20} className="text-emerald-500" weight="duotone" />
                <p className="text-sm text-gray-500">{text.stats.totalWeight}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalWeight} <span className="text-sm text-gray-500">{text.stats.kg}</span>
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['all', 'active', 'completed', 'lost'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {text.filters[f]}
            </button>
          ))}
        </div>

        {/* Batches List */}
        {filteredBatches.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-gray-400" weight="duotone" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{text.empty}</h3>
            <p className="text-gray-500 mb-6">{text.emptyDesc}</p>
            <button
              onClick={() => router.push('/dashboard/batches/new')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium"
            >
              <Plus size={20} weight="bold" />
              {text.addNew}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBatches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Plant size={24} className="text-emerald-600" weight="duotone" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{text.batch.paddy}</h3>
                      <p className="text-sm text-gray-500">
                        ID: {batch.id.slice(-8)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(batch.status)}
                    
                    {/* Action Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === batch.id ? null : batch.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <DotsThreeVertical size={20} weight="bold" className="text-gray-500" />
                      </button>
                      
                      {menuOpen === batch.id && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 min-w-[160px]">
                          {batch.status === 'active' && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmAction({ batchId: batch.id, action: 'completed' });
                                  setMenuOpen(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-green-600"
                              >
                                <CheckCircle size={18} weight="duotone" />
                                {text.actions.markCompleted}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmAction({ batchId: batch.id, action: 'lost' });
                                  setMenuOpen(null);
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-orange-600"
                              >
                                <XCircle size={18} weight="duotone" />
                                {text.actions.markLost}
                              </button>
                            </>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmAction({ batchId: batch.id, action: 'delete' });
                              setMenuOpen(null);
                            }}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                          >
                            <Trash size={18} weight="duotone" />
                            {text.actions.delete}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-600">
                      {text.batch.harvested}: {formatDate(batch.harvestDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Scales size={16} className="text-gray-400" />
                    <span className="text-gray-600">
                      {text.batch.weight}: {batch.weightKg} {text.stats.kg}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Warehouse size={16} className="text-gray-400" />
                    <span className="text-gray-600">
                      {text.batch.storage}: {text.storage[batch.storageType as keyof typeof text.storage]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-gray-600">
                      {lang === 'bn' ? batch.districtBn : batch.district}, {lang === 'bn' ? batch.divisionBn : batch.division}
                    </span>
                  </div>
                </div>

                {batch.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 line-clamp-2">{batch.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmAction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <div className="text-center mb-6">
                {confirmAction.action === 'completed' && (
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} weight="duotone" className="text-green-600" />
                  </div>
                )}
                {confirmAction.action === 'lost' && (
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle size={32} weight="duotone" className="text-orange-600" />
                  </div>
                )}
                {confirmAction.action === 'delete' && (
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash size={32} weight="duotone" className="text-red-600" />
                  </div>
                )}
                <p className="text-gray-900 font-medium">
                  {confirmAction.action === 'completed' && text.actions.confirmCompleted}
                  {confirmAction.action === 'lost' && text.actions.confirmLost}
                  {confirmAction.action === 'delete' && text.actions.confirmDelete}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  {text.actions.cancel}
                </button>
                <button
                  onClick={() => {
                    if (confirmAction.action === 'delete') {
                      handleDeleteBatch(confirmAction.batchId);
                    } else {
                      handleUpdateStatus(confirmAction.batchId, confirmAction.action);
                    }
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl text-white font-medium transition-colors ${
                    confirmAction.action === 'completed' 
                      ? 'bg-green-500 hover:bg-green-600'
                      : confirmAction.action === 'lost'
                      ? 'bg-orange-500 hover:bg-orange-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {text.actions.confirm}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}