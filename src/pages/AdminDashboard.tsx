import React, { useState, useEffect } from 'react';
import { useTranslation } from '../locales/i18nContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Building2, HeartPulse, Heart,
  GraduationCap, ShoppingBag, Home, Landmark, BookOpen,
  ShieldCheck, FileText, Activity, KeyRound, CheckCircle,
  PlusCircle, Search, Trash2, Edit3, DollarSign, Percent, AlertTriangle,
  Sliders, Bell, Settings, X, Save, Eye, Check, RefreshCw,
  Layers, Globe, Sparkles, ExternalLink, Download, ToggleLeft, ToggleRight,
  FolderTree, Share2, HelpCircle, PhoneCall, Database, Wrench, Megaphone, Link
} from 'lucide-react';
import { api } from '../services/api';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS,
  COMMITTEE_LEVELS,
  getDistrictsByDivision,
  getUpazilasByDistrictKey
} from '../data/bangladeshLocations';
import { NavigationMenuItem } from '../types';
import { AdminDonationManager } from '../components/donations/AdminDonationManager';
import { HubAdminBrandingManager } from '../components/hub/HubAdminBrandingManager';

export const AdminDashboard: React.FC = () => {
  const { isBn } = useTranslation();
  const { user, isSuperAdmin, openPasswordChangeModal } = useAuth();

  type AdminTab =
    | 'overview'
    | 'slides'
    | 'ads'
    | 'users'
    | 'ngos'
    | 'donations'
    | 'blood'
    | 'school'
    | 'somiti'
    | 'marketplace'
    | 'realestate'
    | 'marriage'
    | 'notices'
    | 'settings'
    | 'audit';

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Settings Sub-Tabs
  type SettingsSubTab = 'hubs_branding' | 'menus' | 'modules' | 'branding' | 'payments' | 'social' | 'database';
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('hubs_branding');

  // Data Collections
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [adsList, setAdsList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [ngosList, setNgosList] = useState<any[]>([]);
  const [branchesList, setBranchesList] = useState<any[]>([]);
  const [branchSubTab, setBranchSubTab] = useState<'branches' | 'ngos'>('branches');
  const [adminBranchLevel, setAdminBranchLevel] = useState<string>('all');
  const [adminBranchDivision, setAdminBranchDivision] = useState<string>('all');
  const [adminBranchDistrict, setAdminBranchDistrict] = useState<string>('all');
  const [adminBranchUpazila, setAdminBranchUpazila] = useState<string>('all');
  const [adminBranchStatus, setAdminBranchStatus] = useState<string>('all');
  const [adminBranchSearch, setAdminBranchSearch] = useState<string>('');
  const [campaignsList, setCampaignsList] = useState<any[]>([]);
  const [donorsList, setDonorsList] = useState<any[]>([]);
  const [bloodRequests, setBloodRequests] = useState<any[]>([]);
  const [bloodCommitteesList, setBloodCommitteesList] = useState<any[]>([]);
  const [bloodSubTab, setBloodSubTab] = useState<'committee' | 'donors' | 'sos'>('committee');
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [loansList, setLoansList] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [propertiesList, setPropertiesList] = useState<any[]>([]);
  const [marriageList, setMarriageList] = useState<any[]>([]);
  const [noticesList, setNoticesList] = useState<any[]>([]);
  const [menusList, setMenusList] = useState<NavigationMenuItem[]>([]);
  const [settingsData, setSettingsData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Dynamic Navigation Menu Modal State
  const [menuModal, setMenuModal] = useState<{
    isOpen: boolean;
    isNew: boolean;
    data: {
      id?: string;
      title: string;
      titleBn: string;
      route: string;
      category: 'header_main' | 'programs' | 'economic' | 'footer_quick' | 'footer_legal';
      iconName: string;
      description: string;
      descriptionBn: string;
      badge: string;
      badgeBn: string;
      isExternal: boolean;
      externalUrl: string;
      order: number;
      isActive: boolean;
    };
  }>({
    isOpen: false,
    isNew: true,
    data: {
      title: '',
      titleBn: '',
      route: 'home',
      category: 'header_main',
      iconName: 'Layers',
      description: '',
      descriptionBn: '',
      badge: '',
      badgeBn: '',
      isExternal: false,
      externalUrl: '',
      order: 1,
      isActive: true
    }
  });

  // Dynamic Advertisement Modal State
  const [adModal, setAdModal] = useState<{
    isOpen: boolean;
    isNew: boolean;
    data: {
      id?: string;
      title: string;
      titleBn: string;
      imageUrl: string;
      targetUrl: string;
      openInNewTab: boolean;
      position: 'top_leaderboard' | 'home_mid_banner' | 'sidebar_box' | 'content_banner' | 'footer_banner';
      clientName: string;
      startDate: string;
      endDate: string;
      order: number;
      isActive: boolean;
    };
  }>({
    isOpen: false,
    isNew: true,
    data: {
      title: '',
      titleBn: '',
      imageUrl: '',
      targetUrl: '',
      openInNewTab: true,
      position: 'home_mid_banner',
      clientName: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      order: 1,
      isActive: true
    }
  });

  // Dedicated Committee Members Management Modal State
  const [committeeModal, setCommitteeModal] = useState<{
    isOpen: boolean;
    branch: any | null;
    isMemberFormOpen: boolean;
    isNewMember: boolean;
    memberData: {
      id?: string;
      name: string;
      nameBn: string;
      fatherName: string;
      fatherNameBn: string;
      designation: string;
      designationBn: string;
      address: string;
      addressBn: string;
      phone: string;
      email: string;
      photoUrl: string;
      nid: string;
      status: string;
    };
  }>({
    isOpen: false,
    branch: null,
    isMemberFormOpen: false,
    isNewMember: true,
    memberData: {
      name: '',
      nameBn: '',
      fatherName: '',
      fatherNameBn: '',
      designation: 'Executive Member',
      designationBn: 'কার্যনির্বাহী সদস্য',
      address: '',
      addressBn: '',
      phone: '',
      email: '',
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
      nid: '',
      status: 'active'
    }
  });

  // Generic Edit / Create Modal State
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    type: string; // 'slide' | 'user' | 'ngo' | 'branch' | 'campaign' | 'donor' | 'bloodRequest' | 'course' | 'student' | 'loan' | 'product' | 'property' | 'marriage' | 'notice';
    isNew: boolean;
    data: any;
  }>({
    isOpen: false,
    type: '',
    isNew: false,
    data: {}
  });

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        slides, ads, u, n, br, c, d, bReq, bComm, crs, stu, l, p, prop, mar, not, setRes, a, menus
      ] = await Promise.all([
        api.getHeroSlides().catch(() => []),
        api.getAdvertisements('all', false).catch(() => []),
        api.getUsers().catch(() => []),
        api.getNgos().catch(() => []),
        api.getBranches().catch(() => []),
        api.getCampaigns().catch(() => []),
        api.getDonors().catch(() => []),
        api.getBloodRequests().catch(() => []),
        api.getBloodCommittees().catch(() => []),
        api.getCourses().catch(() => []),
        api.getStudents().catch(() => []),
        api.getLoans().catch(() => []),
        api.getProducts().catch(() => []),
        api.getProperties().catch(() => []),
        api.getMarriageProfiles().catch(() => []),
        api.getNotices().catch(() => []),
        api.getSettings().catch(() => null),
        api.getAuditLogs().catch(() => []),
        api.getMenus().catch(() => [])
      ]);

      setHeroSlides(Array.isArray(slides) ? slides : []);
      setAdsList(Array.isArray(ads) ? ads : []);
      setUsersList(Array.isArray(u) ? u : []);
      setNgosList(Array.isArray(n) ? n : []);
      setBranchesList(Array.isArray(br) ? br : []);
      setCampaignsList(Array.isArray(c) ? c : []);
      setDonorsList(Array.isArray(d) ? d : []);
      setBloodRequests(Array.isArray(bReq) ? bReq : []);
      setBloodCommitteesList(Array.isArray(bComm) ? bComm : []);
      setCoursesList(Array.isArray(crs) ? crs : []);
      setStudentsList(Array.isArray(stu) ? stu : []);
      setLoansList(Array.isArray(l) ? l : []);
      setProductsList(Array.isArray(p) ? p : []);
      setPropertiesList(Array.isArray(prop) ? prop : []);
      setMarriageList(Array.isArray(mar) ? mar : []);
      setNoticesList(Array.isArray(not) ? not : []);
      if (setRes) setSettingsData(setRes);
      setAuditLogs(Array.isArray(a) ? a : []);
      setMenusList(Array.isArray(menus) ? menus : []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Modal Open Handlers
  const openCreateModal = (type: string, initialData: any = {}) => {
    setEditModal({
      isOpen: true,
      type,
      isNew: true,
      data: initialData
    });
  };

  const openEditModal = (type: string, item: any) => {
    setEditModal({
      isOpen: true,
      type,
      isNew: false,
      data: { ...item }
    });
  };

  const closeModal = () => {
    setEditModal({ isOpen: false, type: '', isNew: false, data: {} });
  };

  // Menu Modal Handlers
  const handleOpenCreateMenu = (category: 'header_main' | 'programs' | 'economic' | 'footer_quick' = 'header_main') => {
    setMenuModal({
      isOpen: true,
      isNew: true,
      data: {
        title: '',
        titleBn: '',
        route: 'home',
        category,
        iconName: 'Layers',
        description: '',
        descriptionBn: '',
        badge: '',
        badgeBn: '',
        isExternal: false,
        externalUrl: '',
        order: menusList.length + 1,
        isActive: true
      }
    });
  };

  const handleOpenEditMenu = (menu: NavigationMenuItem) => {
    setMenuModal({
      isOpen: true,
      isNew: false,
      data: {
        id: menu.id,
        title: menu.title,
        titleBn: menu.titleBn,
        route: menu.route,
        category: menu.category,
        iconName: menu.iconName || 'Layers',
        description: menu.description || '',
        descriptionBn: menu.descriptionBn || '',
        badge: menu.badge || '',
        badgeBn: menu.badgeBn || '',
        isExternal: !!menu.isExternal,
        externalUrl: menu.externalUrl || '',
        order: menu.order || 1,
        isActive: menu.isActive !== false
      }
    });
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { isNew, data } = menuModal;
      if (isNew) {
        await api.createMenu(data);
        showNotification(isBn ? 'নতুন নেভিগেশন মেনু সফলভাবে যুক্ত হয়েছে!' : 'New menu item created successfully!');
      } else {
        await api.updateMenu(data.id!, data);
        showNotification(isBn ? 'নেভিগেশন মেনু সফলভাবে আপডেট হয়েছে!' : 'Menu item updated successfully!');
      }
      setMenuModal(prev => ({ ...prev, isOpen: false }));
      window.dispatchEvent(new Event('ascado_menus_updated'));
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Menu operation failed', 'error');
    }
  };

  const handleDeleteMenu = async (id: string, name: string) => {
    if (!window.confirm(isBn ? `আপনি কি নিশ্চিত যে "${name}" মেনুটি মুছে ফেলতে চান?` : `Are you sure you want to delete menu "${name}"?`)) {
      return;
    }
    try {
      await api.deleteMenu(id);
      showNotification(isBn ? 'মেনু সফলভাবে মুছে ফেলা হয়েছে!' : 'Menu item deleted successfully!');
      window.dispatchEvent(new Event('ascado_menus_updated'));
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete menu', 'error');
    }
  };

  const handleToggleMenu = async (id: string) => {
    try {
      await api.toggleMenu(id);
      showNotification(isBn ? 'মেনুর সক্রিয় অবস্থা পরিবর্তন করা হয়েছে!' : 'Menu visibility toggled!');
      window.dispatchEvent(new Event('ascado_menus_updated'));
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Toggle failed', 'error');
    }
  };

  const handleResetMenus = async () => {
    if (!window.confirm(isBn ? 'আপনি কি সকল মেনু মূল ডিফল্ট অবস্থায় রিস্টোর করতে চান?' : 'Reset all navigation menus to system default?')) {
      return;
    }
    try {
      await api.resetMenus();
      showNotification(isBn ? 'সকল মেনু ডিফল্ট অবস্থায় রিস্টোর করা হয়েছে!' : 'Menus reset to system defaults!');
      window.dispatchEvent(new Event('ascado_menus_updated'));
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Reset failed', 'error');
    }
  };

  const handleExportBackup = async () => {
    try {
      const data = await api.exportBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ASCAHDO_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification(isBn ? 'সেন্ট্রাল ডাটাবেজ ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে!' : 'Database backup downloaded successfully!');
    } catch (err: any) {
      showNotification(err.message || 'Backup export failed', 'error');
    }
  };

  const handleSystemReset = async () => {
    if (!window.confirm(isBn ? 'সিস্টেম ক্যাশ ও স্টোরেজ সিঙ্ক করতে চান?' : 'Perform system state sync & cache refresh?')) {
      return;
    }
    try {
      await api.resetSystemData();
      showNotification(isBn ? 'সিস্টেম স্টেট ও ক্যাশ সফলভাবে সিঙ্ক হয়েছে!' : 'System state synchronized successfully!');
      window.dispatchEvent(new Event('ascado_menus_updated'));
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'System sync failed', 'error');
    }
  };

  // Advertisement Handlers
  const handleOpenCreateAd = (position: any = 'home_mid_banner') => {
    setAdModal({
      isOpen: true,
      isNew: true,
      data: {
        title: '',
        titleBn: '',
        imageUrl: '',
        targetUrl: 'https://',
        openInNewTab: true,
        position,
        clientName: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        order: adsList.length + 1,
        isActive: true
      }
    });
  };

  const handleOpenEditAd = (ad: any) => {
    setAdModal({
      isOpen: true,
      isNew: false,
      data: {
        id: ad.id,
        title: ad.title || '',
        titleBn: ad.titleBn || '',
        imageUrl: ad.imageUrl || '',
        targetUrl: ad.targetUrl || '',
        openInNewTab: ad.openInNewTab !== false,
        position: ad.position || 'home_mid_banner',
        clientName: ad.clientName || '',
        startDate: ad.startDate || '',
        endDate: ad.endDate || '',
        order: ad.order || 1,
        isActive: ad.isActive !== false
      }
    });
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { isNew, data } = adModal;
      if (isNew) {
        await api.createAdvertisement(data);
        showNotification(isBn ? 'নতুন বিজ্ঞাপন সফলভাবে যুক্ত হয়েছে!' : 'New advertisement created successfully!');
      } else {
        await api.updateAdvertisement(data.id!, data);
        showNotification(isBn ? 'বিজ্ঞাপন সফলভাবে আপডেট হয়েছে!' : 'Advertisement updated successfully!');
      }
      setAdModal(prev => ({ ...prev, isOpen: false }));
      window.dispatchEvent(new Event('ascado_ads_updated'));
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Ad operation failed', 'error');
    }
  };

  const handleDeleteAd = async (id: string, name: string) => {
    if (!window.confirm(isBn ? `আপনি কি নিশ্চিত যে "${name}" বিজ্ঞাপনটি মুছে ফেলতে চান?` : `Are you sure you want to delete advertisement "${name}"?`)) {
      return;
    }
    try {
      await api.deleteAdvertisement(id);
      showNotification(isBn ? 'বিজ্ঞাপন সফলভাবে মুছে ফেলা হয়েছে!' : 'Advertisement deleted successfully!');
      window.dispatchEvent(new Event('ascado_ads_updated'));
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete advertisement', 'error');
    }
  };

  const handleToggleAd = async (ad: any) => {
    try {
      await api.updateAdvertisement(ad.id, { isActive: !ad.isActive });
      showNotification(isBn ? 'বিজ্ঞাপনের দৃশ্যমানতা পরিবর্তন করা হয়েছে!' : 'Ad visibility toggled!');
      window.dispatchEvent(new Event('ascado_ads_updated'));
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Toggle failed', 'error');
    }
  };

  // Form Field Change in Modal
  const handleModalFieldChange = (field: string, value: any) => {
    setEditModal(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value }
    }));
  };

  // Save Modal Changes
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    const { type, isNew, data } = editModal;
    try {
      switch (type) {
        case 'slide':
          if (isNew) await api.createHeroSlide(data);
          else await api.updateHeroSlide(data.id, data);
          break;
        case 'user':
          if (isNew) await api.createUser(data);
          else await api.updateUser(data.id, data);
          break;
        case 'ngo':
          if (isNew) await api.createNgo(data);
          else await api.updateOrganization(data.id, data);
          break;
        case 'branch':
          if (isNew) await api.createBranch(data);
          else await api.updateBranch(data.id, data);
          break;
        case 'campaign':
          if (isNew) await api.createCampaign(data);
          else await api.updateCampaign(data.id, data);
          break;
        case 'donor':
          if (isNew) await api.registerDonor(data);
          else await api.updateDonor(data.id, data);
          break;
        case 'bloodCommittee':
          if (isNew) await api.createBloodCommittee(data);
          else await api.updateBloodCommittee(data.id, data);
          break;
        case 'bloodRequest':
          await api.updateBloodRequest(data.id, data);
          break;
        case 'course':
          if (isNew) await api.createCourse(data);
          else await api.updateCourse(data.id, data);
          break;
        case 'student':
          if (isNew) await api.createStudent(data);
          else await api.updateStudent(data.id, data);
          break;
        case 'loan':
          if (isNew) await api.applyLoan(data);
          else await api.updateLoan(data.id, data);
          break;
        case 'product':
          if (isNew) await api.createProduct(data);
          else await api.updateProduct(data.id, data);
          break;
        case 'property':
          if (isNew) await api.createProperty(data);
          else await api.updateProperty(data.id, data);
          break;
        case 'marriage':
          if (isNew) await api.createMarriageProfile(data);
          else await api.updateMarriageProfile(data.id, data);
          break;
        case 'notice':
          if (isNew) await api.createNotice(data);
          else await api.updateNotice(data.id, data);
          break;
        default:
          break;
      }
      showNotification(isBn ? 'সফলভাবে সংরক্ষিত হয়েছে!' : 'Successfully saved!');
      closeModal();
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Operation failed', 'error');
    }
  };

  // Delete Action Handler
  const handleDeleteItem = async (type: string, id: string, name: string) => {
    if (!window.confirm(isBn ? `আপনি কি নিশ্চিত যে "${name}" মুছে ফেলতে চান?` : `Are you sure you want to delete "${name}"?`)) {
      return;
    }
    try {
      switch (type) {
        case 'slide': await api.deleteHeroSlide(id); break;
        case 'user': await api.deleteUser(id); break;
        case 'ngo': await api.deleteOrganization(id); break;
        case 'branch': await api.deleteBranch(id); break;
        case 'campaign': await api.deleteCampaign(id); break;
        case 'donor': await api.deleteDonor(id); break;
        case 'bloodCommittee': await api.deleteBloodCommittee(id); break;
        case 'bloodRequest': await api.deleteBloodRequest(id); break;
        case 'course': await api.deleteCourse(id); break;
        case 'student': await api.deleteStudent(id); break;
        case 'loan': await api.deleteLoan(id); break;
        case 'product': await api.deleteProduct(id); break;
        case 'property': await api.deleteProperty(id); break;
        case 'marriage': await api.deleteMarriageProfile(id); break;
        case 'notice': await api.deleteNotice(id); break;
        default: break;
      }
      showNotification(isBn ? 'সফলভাবে মুছে ফেলা হয়েছে!' : 'Item deleted successfully!');
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Delete failed', 'error');
    }
  };

  // Dedicated Branch Actions & Committee Handlers
  const handleApproveBranch = async (branch: any) => {
    if (!window.confirm(isBn ? `আপনি কি "${branch.nameBn || branch.name}" শাখা অনুমোদন ও কার্যনির্বাহী কমিটি পাবলিশ করতে চান?` : `Approve branch "${branch.name}" and publish its executive committee?`)) {
      return;
    }
    try {
      const res = await api.approveBranch(branch.id);
      showNotification(isBn ? `শাখা "${branch.nameBn || branch.name}" সফলভাবে অনুমোদিত এবং কমিটি প্রকাশিত হয়েছে!` : 'Branch approved & committee published!');
      loadAllData();
      if (committeeModal.isOpen && committeeModal.branch?.id === branch.id) {
        setCommitteeModal(prev => ({ ...prev, branch: res.branch || { ...prev.branch, status: 'active', committeePublished: true } }));
      }
    } catch (err: any) {
      showNotification(err.message || 'Approval failed', 'error');
    }
  };

  const handleTogglePublishCommittee = async (branch: any) => {
    try {
      const res = await api.togglePublishCommittee(branch.id);
      showNotification(isBn ? `কমিটি পাবলিশ স্ট্যাটাস সফলভাবে পরিবর্তন করা হয়েছে!` : 'Committee visibility toggled!');
      loadAllData();
      if (committeeModal.isOpen && committeeModal.branch?.id === branch.id) {
        setCommitteeModal(prev => ({ ...prev, branch: res.branch || { ...prev.branch, committeePublished: !prev.branch.committeePublished } }));
      }
    } catch (err: any) {
      showNotification(err.message || 'Action failed', 'error');
    }
  };

  const openCommitteeManagement = (branch: any) => {
    setCommitteeModal({
      isOpen: true,
      branch: { ...branch },
      isMemberFormOpen: false,
      isNewMember: true,
      memberData: {
        name: '',
        nameBn: '',
        fatherName: '',
        fatherNameBn: '',
        designation: 'Executive Member',
        designationBn: 'কার্যনির্বাহী সদস্য',
        address: '',
        addressBn: '',
        phone: '',
        email: '',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
        nid: '',
        status: 'active'
      }
    });
  };

  const openAddMemberForm = () => {
    setCommitteeModal(prev => ({
      ...prev,
      isMemberFormOpen: true,
      isNewMember: true,
      memberData: {
        name: '',
        nameBn: '',
        fatherName: '',
        fatherNameBn: '',
        designation: 'Executive Member',
        designationBn: 'কার্যনির্বাহী সদস্য',
        address: '',
        addressBn: '',
        phone: '',
        email: '',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
        nid: '',
        status: 'active'
      }
    }));
  };

  const openEditMemberForm = (member: any) => {
    setCommitteeModal(prev => ({
      ...prev,
      isMemberFormOpen: true,
      isNewMember: false,
      memberData: { ...member }
    }));
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!committeeModal.branch) return;

    try {
      const { isNewMember, memberData, branch } = committeeModal;
      let res;
      if (isNewMember) {
        res = await api.addCommitteeMember(branch.id, memberData);
      } else {
        res = await api.updateCommitteeMember(branch.id, memberData.id!, memberData);
      }

      showNotification(isBn ? 'কমিটি সদস্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Committee member saved successfully!');
      
      // Update local modal branch state
      const updatedBranch = res.branch || {
        ...branch,
        committeeMembers: isNewMember
          ? [...(branch.committeeMembers || []), res.member || memberData]
          : (branch.committeeMembers || []).map((m: any) => m.id === memberData.id ? (res.member || memberData) : m)
      };

      setCommitteeModal(prev => ({
        ...prev,
        branch: updatedBranch,
        isMemberFormOpen: false
      }));

      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save member', 'error');
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!committeeModal.branch) return;
    if (!window.confirm(isBn ? `আপনি কি নিশ্চিত যে "${memberName}"-কে কমিটি থেকে মুছে ফেলতে চান?` : `Remove "${memberName}" from committee?`)) {
      return;
    }

    try {
      const res = await api.deleteCommitteeMember(committeeModal.branch.id, memberId);
      showNotification(isBn ? 'সদস্য মুছে ফেলা হয়েছে!' : 'Member removed from committee!');
      
      const updatedBranch = res.branch || {
        ...committeeModal.branch,
        committeeMembers: (committeeModal.branch.committeeMembers || []).filter((m: any) => m.id !== memberId)
      };

      setCommitteeModal(prev => ({
        ...prev,
        branch: updatedBranch
      }));

      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete member', 'error');
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings(settingsData);
      showNotification(isBn ? 'সিস্টেম সেটিংস সফলভাবে হালনাগাদ করা হয়েছে!' : 'System settings updated successfully!');
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update settings', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-slate-800">
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 w-full md:w-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40 shrink-0">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-black truncate">
                {isBn ? 'সুপার অ্যাডমিন ও সেন্ট্রাল কন্ট্রোল কনসোল' : 'Central Admin Management Console'}
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full uppercase border border-emerald-500/30 shrink-0">
                {user?.role || 'SUPER_ADMIN'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 truncate">
              {isBn ? 'অ্যাডমিন অ্যাকাউন্ট:' : 'Logged in as:'}{' '}
              <span className="font-bold text-slate-200">{user?.fullName || user?.email}</span> • ASCAHDO Enterprise Core
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={loadAllData}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
          </button>

          <button
            onClick={openPasswordChangeModal}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Master Key'}</span>
          </button>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg transition-all animate-fadeIn ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Navigation Pills (14 Comprehensive Modules) */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        {[
          { id: 'overview', label: isBn ? 'সারসংক্ষেপ' : 'Overview', icon: LayoutDashboard },
          { id: 'slides', label: isBn ? 'স্লাইডার এডিটর' : 'Hero Slider', icon: Sliders },
          { id: 'ads', label: isBn ? 'বিজ্ঞাপন ও লিংক' : 'Ads & Banners', icon: Megaphone },
          { id: 'users', label: isBn ? 'ইউজার ও RBAC' : 'Users & RBAC', icon: Users },
          { id: 'ngos', label: isBn ? 'এনজিও ও শাখা' : 'NGOs & Branches', icon: Building2 },
          { id: 'donations', label: isBn ? 'তহবিল ও অনুদান' : 'Donations', icon: Heart },
          { id: 'blood', label: isBn ? 'ব্লাড ব্যাংক ও SOS' : 'Blood Bank', icon: HeartPulse },
          { id: 'school', label: isBn ? 'স্কুল ও কোর্স' : 'School & LMS', icon: GraduationCap },
          { id: 'somiti', label: isBn ? 'ক্ষুদ্রঋণ সমিতি' : 'Somiti Loans', icon: Landmark },
          { id: 'marketplace', label: isBn ? 'মার্কেটপ্লেস (১০%)' : 'Marketplace (10%)', icon: ShoppingBag },
          { id: 'realestate', label: isBn ? 'রিয়েল এস্টেট' : 'Real Estate', icon: Home },
          { id: 'marriage', label: isBn ? 'ম্যারেজ মিডিয়া' : 'Marriage Media', icon: Heart },
          { id: 'notices', label: isBn ? 'নোটিশ ও সিএমএস' : 'Notices', icon: Bell },
          { id: 'settings', label: isBn ? 'সিস্টেম সেটিংস' : 'Settings', icon: Settings },
          { id: 'audit', label: isBn ? 'অডিট লগ' : 'Audit Logs', icon: Activity }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as AdminTab);
                setSearchTerm('');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          1. TAB: OVERVIEW
      ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">{isBn ? 'নিবন্ধিত এনজিও' : 'Total NGOs'}</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{ngosList.length}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">{isBn ? 'সক্রিয় ব্যবহারকারী' : 'Active Users'}</span>
              <div className="text-2xl font-black text-blue-600 mt-1">{usersList.length}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">{isBn ? 'সক্রিয় রক্তদাতা' : 'Blood Donors'}</span>
              <div className="text-2xl font-black text-rose-600 mt-1">{donorsList.length}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">{isBn ? 'হোমপেজ স্লাইড' : 'Hero Slides'}</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{heroSlides.length}</div>
            </div>
          </div>

          {/* Quick Shortcuts to Edit Features */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              {isBn ? 'ফিচার এডিটর কুইক শর্টকাট' : 'Quick Feature Management Access'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => setActiveTab('slides')}
                className="p-3.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 rounded-xl font-bold text-left flex items-center justify-between transition"
              >
                <span>{isBn ? 'স্লাইডার পরিবর্তন' : 'Manage Slides'}</span>
                <Sliders className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                onClick={() => setActiveTab('donations')}
                className="p-3.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 rounded-xl font-bold text-left flex items-center justify-between transition"
              >
                <span>{isBn ? 'ক্যাম্পেইন এডিট' : 'Edit Campaigns'}</span>
                <Heart className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                onClick={() => setActiveTab('blood')}
                className="p-3.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 rounded-xl font-bold text-left flex items-center justify-between transition"
              >
                <span>{isBn ? 'ব্লাড ব্যাংক ম্যানেজ' : 'Manage Blood Bank'}</span>
                <HeartPulse className="w-4 h-4 text-rose-600" />
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="p-3.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 rounded-xl font-bold text-left flex items-center justify-between transition"
              >
                <span>{isBn ? 'গেটওয়ে ও সেটিংস' : 'System Settings'}</span>
                <Settings className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2. TAB: HERO SLIDES (হোমপেজ ফটো স্লাইডার এডিটর)
      ======================================================== */}
      {activeTab === 'slides' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                <span>{isBn ? 'হোমপেজ ফটো স্লাইডার ম্যানেজমেন্ট ও এডিটর' : 'Homepage Hero Photo Slider Editor'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn ? 'হোমপেজের প্রতিটি স্লাইডের ব্যানার ইমেজ, শিরোনাম, বাংলা টেক্সট ও অ্যাকশন বাটন সহজে এডিট করুন।' : 'Add, edit, reorder or delete hero carousel slides on the homepage.'}
              </p>
            </div>

            <button
              onClick={() => openCreateModal('slide', {
                title: 'New Empowering Welfare Program',
                titleBn: 'নতুন কল্যাণমূলক উদ্যোগ ও সহায়তা কর্মসূচি',
                subtitle: 'Empowering communities with digital social welfare services.',
                subtitleBn: 'ডিজিটাল সমাজকল্যাণ সেবায় দেশজুড়ে জনকল্যাণমূলক কার্যক্রম।',
                badge: 'Verified Program',
                badgeBn: 'ভেরিফাইড সামাজিক কার্যক্রম',
                imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80',
                buttonText: 'Join Campaign',
                buttonTextBn: 'তহবিলে অংশ নিন',
                buttonAction: 'donation',
                secondaryButtonText: 'Learn More',
                secondaryButtonTextBn: 'বিস্তারিত জানুন',
                secondaryButtonAction: 'school',
                active: true
              })}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isBn ? 'নতুন স্লাইড যুক্ত করুন' : 'Add New Slide'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="relative h-44 w-full bg-slate-900">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-full border border-slate-700">
                    Slide #{idx + 1}
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      slide.active !== false ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {slide.active !== false ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Inactive')}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 bg-slate-950/70 backdrop-blur-xs p-2 rounded-xl text-white">
                    <span className="text-[10px] text-emerald-300 font-bold block">{slide.badgeBn || slide.badge}</span>
                    <h4 className="font-extrabold text-xs sm:text-sm line-clamp-1">{slide.titleBn || slide.title}</h4>
                  </div>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="line-clamp-2 text-slate-700">
                      <span className="font-bold text-slate-900">{isBn ? 'বিবরণ:' : 'Subtitle:'} </span>
                      {slide.subtitleBn || slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                        বাটন ১: {slide.buttonTextBn || slide.buttonText} ({slide.buttonAction})
                      </span>
                      {slide.secondaryButtonText && (
                        <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-semibold">
                          বাটন ২: {slide.secondaryButtonTextBn || slide.secondaryButtonText} ({slide.secondaryButtonAction})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEditModal('slide', slide)}
                      className="flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isBn ? 'এডিট করুন' : 'Edit Slide'}</span>
                    </button>

                    <button
                      onClick={() => handleDeleteItem('slide', slide.id, slide.titleBn || slide.title)}
                      className="flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          2.5 TAB: ADVERTISEMENTS & SPONSOR BANNERS (বিজ্ঞাপন ও লিংক)
      ======================================================== */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          {/* Header & Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                    <Megaphone className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {isBn ? 'বিজ্ঞাপন ও স্পনসর লিংক ব্যবস্থাপনা' : 'Advertisement & Sponsor Banner Hub'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn
                        ? 'মাল্টি-ওয়েবসাইটের ৫টি নির্ধারিত স্লটে ছবি, টেক্সট ও লিংক সহ বিজ্ঞাপন প্রদর্শন এবং ক্লিক ট্র্যাকিং'
                        : 'Manage image & link advertisements across 5 designated slots with real-time impression & click analytics'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleOpenCreateAd('home_mid_banner')}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs shadow-md transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isBn ? 'নতুন বিজ্ঞাপন যোগ করুন' : 'Create New Ad'}</span>
                </button>
              </div>
            </div>

            {/* Quick Analytics Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">{isBn ? 'মোট বিজ্ঞাপন' : 'Total Ads'}</span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{adsList.length}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3.5">
                <span className="text-[11px] font-bold text-emerald-700 uppercase">{isBn ? 'সক্রিয় বিজ্ঞাপন' : 'Active Ads'}</span>
                <p className="text-2xl font-black text-emerald-800 mt-0.5">
                  {(adsList || []).filter(a => a && a.isActive !== false).length}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-3.5">
                <span className="text-[11px] font-bold text-blue-700 uppercase">{isBn ? 'মোট ভিউ / ইমপ্রেশন' : 'Total Impressions'}</span>
                <p className="text-2xl font-black text-blue-800 mt-0.5">
                  {adsList.reduce((sum, a) => sum + (a.impressions || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5">
                <span className="text-[11px] font-bold text-amber-700 uppercase">{isBn ? 'মোট ক্লিক সংখ্যা' : 'Total Clicks'}</span>
                <p className="text-2xl font-black text-amber-800 mt-0.5">
                  {adsList.reduce((sum, a) => sum + (a.clicks || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Placement Slots Guide & Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-700">{isBn ? 'স্লট ফিল্টার:' : 'Slot Filter:'}</span>
                {[
                  { id: 'all', label: isBn ? 'সকল স্লট' : 'All Slots' },
                  { id: 'top_leaderboard', label: isBn ? 'টপ লিডারবোর্ড' : 'Top Leaderboard' },
                  { id: 'home_mid_banner', label: isBn ? 'হোমপেজ মিড ব্যানার' : 'Home Mid Banner' },
                  { id: 'sidebar_box', label: isBn ? 'সাইডবার বক্স' : 'Sidebar Box' },
                  { id: 'content_banner', label: isBn ? 'ইন-কন্টেন্ট ব্যানার' : 'Content Banner' },
                  { id: 'footer_banner', label: isBn ? 'ফুটার ব্যানার' : 'Footer Banner' },
                ].map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => setSearchTerm(slot.id === 'all' ? '' : slot.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition ${
                      (searchTerm === slot.id || (slot.id === 'all' && !searchTerm))
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Advertisements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(adsList || [])
              .filter(ad => {
                if (!ad) return false;
                if (!searchTerm) return true;
                return (
                  ad.position === searchTerm ||
                  (ad.title && ad.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (ad.titleBn && ad.titleBn.includes(searchTerm)) ||
                  (ad.clientName && ad.clientName.toLowerCase().includes(searchTerm.toLowerCase()))
                );
              })
              .map(ad => {
                const ctr = ad.impressions && ad.impressions > 0
                  ? ((ad.clicks / ad.impressions) * 100).toFixed(1)
                  : '0.0';

                const positionLabels: Record<string, { label: string; bg: string }> = {
                  top_leaderboard: { label: isBn ? 'টপ হেডার' : 'Top Leaderboard', bg: 'bg-indigo-100 text-indigo-800' },
                  home_mid_banner: { label: isBn ? 'হোম মিড ব্যানার' : 'Home Mid Banner', bg: 'bg-amber-100 text-amber-800' },
                  sidebar_box: { label: isBn ? 'সাইডবার বক্স' : 'Sidebar Box', bg: 'bg-cyan-100 text-cyan-800' },
                  content_banner: { label: isBn ? 'ইন-কন্টেন্ট ব্যানার' : 'Content Banner', bg: 'bg-emerald-100 text-emerald-800' },
                  footer_banner: { label: isBn ? 'ফুটার ব্যানার' : 'Footer Banner', bg: 'bg-purple-100 text-purple-800' }
                };

                const posInfo = positionLabels[ad.position] || { label: ad.position, bg: 'bg-slate-100 text-slate-800' };

                return (
                  <div
                    key={ad.id}
                    className={`bg-white rounded-2xl border ${
                      ad.isActive !== false ? 'border-slate-200' : 'border-rose-200 opacity-75'
                    } overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group`}
                  >
                    <div>
                      {/* Image Preview & Slot Badge */}
                      <div className="h-44 overflow-hidden relative bg-slate-900 flex items-center justify-center">
                        {ad.imageUrl ? (
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-slate-400">
                            <Megaphone className="w-8 h-8 text-slate-500" />
                            <span className="text-xs">No Image Banner</span>
                          </div>
                        )}

                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase shadow-sm ${posInfo.bg}`}>
                            {posInfo.label}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ad.isActive !== false ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                          }`}>
                            {ad.isActive !== false ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'বন্ধ' : 'Inactive')}
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h4 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition line-clamp-1">
                            {isBn ? (ad.titleBn || ad.title) : (ad.title || ad.titleBn)}
                          </h4>
                          {ad.clientName && (
                            <p className="text-xs text-slate-500 font-semibold mt-0.5">
                              {isBn ? 'ক্লায়েন্ট:' : 'Sponsor:'} {ad.clientName}
                            </p>
                          )}
                        </div>

                        {/* Link Info */}
                        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-slate-600 truncate mr-2">
                            <Link className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate font-mono text-[11px]">{ad.targetUrl}</span>
                          </div>
                          <a
                            href={ad.targetUrl}
                            target={ad.openInNewTab ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-800 p-1 hover:bg-emerald-50 rounded shrink-0 transition"
                            title="Test Target Link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        {/* Impression & Click Stats */}
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                          <div className="bg-slate-100/70 p-2 rounded-lg">
                            <span className="text-[10px] text-slate-500 block">{isBn ? 'ভিউ' : 'Views'}</span>
                            <span className="font-black text-slate-800">{ad.impressions || 0}</span>
                          </div>
                          <div className="bg-slate-100/70 p-2 rounded-lg">
                            <span className="text-[10px] text-slate-500 block">{isBn ? 'ক্লিক' : 'Clicks'}</span>
                            <span className="font-black text-emerald-700">{ad.clicks || 0}</span>
                          </div>
                          <div className="bg-slate-100/70 p-2 rounded-lg">
                            <span className="text-[10px] text-slate-500 block">CTR</span>
                            <span className="font-black text-amber-700">{ctr}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleAd(ad)}
                        className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition ${
                          ad.isActive !== false
                            ? 'text-rose-700 bg-white border-rose-200 hover:bg-rose-50'
                            : 'text-emerald-700 bg-white border-emerald-200 hover:bg-emerald-50'
                        }`}
                      >
                        {ad.isActive !== false ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                        <span>{ad.isActive !== false ? (isBn ? 'বন্ধ করুন' : 'Deactivate') : (isBn ? 'চালু করুন' : 'Activate')}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditAd(ad)}
                          className="flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isBn ? 'সম্পাদনা' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id, ad.titleBn || ad.title)}
                          className="flex items-center gap-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold px-3 py-1.5 rounded-lg text-xs transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {adsList.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <Megaphone className="w-12 h-12 text-slate-300 mx-auto" />
              <div>
                <h4 className="font-bold text-slate-800 text-base">
                  {isBn ? 'কোন বিজ্ঞাপন যুক্ত করা হয়নি' : 'No advertisements created yet'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  {isBn
                    ? 'আপনার মাল্টি-ওয়েবসাইটের হেডার, মিড ব্যানার, সাইডবার ও ফুটারে লিঙ্ক সহ বিজ্ঞাপন প্রদর্শন করতে উপরের বাটনে ক্লিক করুন।'
                    : 'Click Create New Ad above to launch banners and sponsored links across all designated website slots.'}
                </p>
              </div>
              <button
                onClick={() => handleOpenCreateAd('home_mid_banner')}
                className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow hover:bg-emerald-700 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isBn ? 'প্রথম বিজ্ঞাপন যোগ করুন' : 'Add First Advertisement'}</span>
              </button>
            </div>
          )}
        </div>
      )}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>{isBn ? 'ব্যবহারকারী ও রোল ম্যানেজমেন্ট (RBAC)' : 'User Directory & Role Based Access'}</span>
            </h3>

            <button
              onClick={() => openCreateModal('user', {
                username: '',
                fullName: '',
                role: 'org_admin',
                phone: '01700000000',
                district: 'Dhaka',
                upazila: 'Dhanmondi',
                password: 'User@123456'
              })}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isBn ? 'নতুন ইউজার তৈরি' : 'Add User'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="py-3 px-4">ইউজারনেম</th>
                  <th className="py-3 px-4">পূর্ণ নাম</th>
                  <th className="py-3 px-4">রোল</th>
                  <th className="py-3 px-4">মোবাইল</th>
                  <th className="py-3 px-4">জেলা</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{u.username}</td>
                    <td className="py-3 px-4">{u.fullName}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{u.phone}</td>
                    <td className="py-3 px-4">{u.district}</td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal('user', u)}
                        className="text-emerald-700 hover:text-emerald-800 p-1 font-bold inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isBn ? 'এডিট' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteItem('user', u.id, u.fullName || u.username)}
                        className="text-rose-600 hover:text-rose-700 p-1 font-bold inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          4. TAB: BRANCHES, COMMITTEES & NGOS
      ======================================================== */}
      {activeTab === 'ngos' && (
        <div className="space-y-6">
          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setBranchSubTab('branches')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                branchSubTab === 'branches'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{isBn ? 'জেলা শাখা ও কার্যনির্বাহী পরিচালনা কমিটি' : 'District Branches & Executive Committees'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${branchSubTab === 'branches' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {branchesList.length}
              </span>
            </button>

            <button
              onClick={() => setBranchSubTab('ngos')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                branchSubTab === 'ngos'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{isBn ? 'সমন্বিত এনজিও ও অংশীদারসমূহ' : 'Affiliated NGOs'}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${branchSubTab === 'ngos' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {ngosList.length}
              </span>
            </button>
          </div>

          {/* BRANCHES & COMMITTEES VIEW */}
          {branchSubTab === 'branches' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                    <span>{isBn ? 'অনুমোদিত ও আবেদনাধীন শাখা কমিটি ব্যবস্থাপনা' : 'Branch Committee Administration'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'প্রতিটি শাখার আবেদন অনুমোদন করুন, এবং ছবি, নাম, পিতার নাম, পদবি ও ঠিকানাসহ সম্পূর্ণ কমিটি পাবলিশ করুন।'
                      : 'Approve branch proposals and publish executive committee member rosters.'}
                  </p>
                </div>

                <button
                  onClick={() => openCreateModal('branch', {
                    name: 'Barishal Divisional Branch',
                    nameBn: 'বরিশাল বিভাগীয় শাখা',
                    branchCode: `ASC-BR-${Math.floor(100 + Math.random() * 900)}`,
                    district: 'Barishal',
                    upazila: 'Kotwali',
                    address: 'Band Road, Barishal Sadar',
                    addressBn: 'বান্দ রোড, বরিশাল সদর',
                    phone: '01711998877',
                    email: 'barishal@ascado.org',
                    managerName: 'Kazi Ruhul Amin',
                    managerNameBn: 'কাজী রুহুল আমিন',
                    status: 'approved',
                    committeePublished: true,
                    committeeTerm: '2025-2027',
                    committeeTitleBn: 'দ্বি-বার্ষিক কার্যনির্বাহী পরিষদ',
                    committeeMembers: [
                      {
                        name: 'Al-Haj Md. Rafiqul Islam',
                        nameBn: 'আলহাজ্ব মো. রফিকুল ইসলাম',
                        fatherName: 'Late Al-Haj Abdul Karim',
                        fatherNameBn: 'মরহুম আলহাজ্ব আব্দুল করিম',
                        designation: 'President',
                        designationBn: 'সভাপতি',
                        address: 'Word 14, Barishal City',
                        addressBn: '১৪ নং ওয়ার্ড, বরিশাল সিটি কর্পোরেশন',
                        phone: '01711223344',
                        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
                        status: 'active'
                      },
                      {
                        name: 'Advocate Shamsul Haque',
                        nameBn: 'অ্যাডভোকেট শামসুল হক',
                        fatherName: 'Late Joynal Abedin',
                        fatherNameBn: 'মরহুম জয়নাল আবেদীন',
                        designation: 'General Secretary',
                        designationBn: 'সাধারণ সম্পাদক',
                        address: 'Sadar Road, Barishal',
                        addressBn: 'সদর রোড, বরিশাল',
                        phone: '01711334455',
                        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
                        status: 'active'
                      }
                    ]
                  })}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isBn ? 'নতুন শাখা আবেদন যোগ করুন' : 'Create Branch Application'}</span>
                </button>
              </div>

              {/* Hierarchy Metrics Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <span className="text-xl">🏛️</span>
                  <div className="text-lg font-black text-slate-800 mt-1">
                    {(branchesList || []).filter(b => b && (b.committeeLevel || '').toLowerCase() === 'division').length}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">{isBn ? 'বিভাগীয় কমিটি' : 'Division'}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <span className="text-xl">🏢</span>
                  <div className="text-lg font-black text-slate-800 mt-1">
                    {(branchesList || []).filter(b => b && (b.committeeLevel || 'district').toLowerCase() === 'district').length}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">{isBn ? 'জেলা কমিটি' : 'District'}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <span className="text-xl">🏬</span>
                  <div className="text-lg font-black text-slate-800 mt-1">
                    {(branchesList || []).filter(b => b && (b.committeeLevel || '').toLowerCase() === 'upazila').length}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">{isBn ? 'উপজেলা কমিটি' : 'Upazila'}</div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <span className="text-xl">🏘️</span>
                  <div className="text-lg font-black text-slate-800 mt-1">
                    {(branchesList || []).filter(b => b && (b.committeeLevel || '').toLowerCase() === 'union').length}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">{isBn ? 'ইউনিয়ন / ওয়ার্ড' : 'Union / Ward'}</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                  <span className="text-xl">⏳</span>
                  <div className="text-lg font-black text-amber-900 mt-1">
                    {(branchesList || []).filter(b => b && (b.status === 'pending_approval' || b.status === 'pending')).length}
                  </div>
                  <div className="text-[11px] font-bold text-amber-700">{isBn ? 'আবেদন প্রক্রিয়াধীন' : 'Pending'}</div>
                </div>
              </div>

              {/* Administrative Filter Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                {/* Level Tabs */}
                <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-200">
                  {COMMITTEE_LEVELS.map(lvl => (
                    <button
                      key={lvl.id}
                      onClick={() => setAdminBranchLevel(lvl.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                        adminBranchLevel === lvl.id
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lvl.icon && <span>{lvl.icon}</span>}
                      <span>{isBn ? lvl.nameBn : lvl.name}</span>
                    </button>
                  ))}
                </div>

                {/* Division, District, Upazila & Search */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 text-xs">
                  {/* Division */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{isBn ? 'বিভাগ নির্বাচন' : 'Division'}</label>
                    <select
                      value={adminBranchDivision}
                      onChange={(e) => {
                        setAdminBranchDivision(e.target.value);
                        setAdminBranchDistrict('all');
                        setAdminBranchUpazila('all');
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
                    >
                      <option value="all">{isBn ? 'সকল বিভাগ (All)' : 'All Divisions'}</option>
                      {BANGLADESH_DIVISIONS.map(d => (
                        <option key={d.id} value={d.id}>{isBn ? d.nameBn : d.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{isBn ? 'জেলা নির্বাচন' : 'District'}</label>
                    <select
                      value={adminBranchDistrict}
                      onChange={(e) => {
                        setAdminBranchDistrict(e.target.value);
                        setAdminBranchUpazila('all');
                      }}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
                    >
                      <option value="all">{isBn ? 'সকল জেলা (All)' : 'All Districts'}</option>
                      {getDistrictsByDivision(adminBranchDivision).map(({ key, district }) => (
                        <option key={key} value={district.name}>{isBn ? district.nameBn : district.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Upazila */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{isBn ? 'উপজেলা নির্বাচন' : 'Upazila'}</label>
                    <select
                      value={adminBranchUpazila}
                      onChange={(e) => setAdminBranchUpazila(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
                    >
                      <option value="all">{isBn ? 'সকল উপজেলা (All)' : 'All Upazilas'}</option>
                      {adminBranchDistrict !== 'all' && getUpazilasByDistrictKey(adminBranchDistrict).map(upz => (
                        <option key={upz} value={upz}>{upz}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{isBn ? 'অনুমোদন স্ট্যাটাস' : 'Status'}</label>
                    <select
                      value={adminBranchStatus}
                      onChange={(e) => setAdminBranchStatus(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg p-2 font-medium"
                    >
                      <option value="all">{isBn ? 'সকল স্ট্যাটাস' : 'All Status'}</option>
                      <option value="active">{isBn ? 'অনুমোদিত ও সক্রিয়' : 'Active / Approved'}</option>
                      <option value="pending_approval">{isBn ? 'আবেদন প্রক্রিয়াধীন' : 'Pending Approval'}</option>
                    </select>
                  </div>

                  {/* Search */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{isBn ? 'অনুসন্ধান' : 'Search'}</label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder={isBn ? 'কোড, নাম, পদবি...' : 'Code, name, leader...'}
                        value={adminBranchSearch}
                        onChange={(e) => setAdminBranchSearch(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-2 py-2 font-medium text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Branch Cards & Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {(branchesList || [])
                  .filter((branch) => {
                    if (!branch) return false;
                    if (adminBranchLevel !== 'all') {
                      const bLevel = (branch.committeeLevel || 'district').toLowerCase();
                      if (bLevel !== adminBranchLevel.toLowerCase()) return false;
                    }
                    if (adminBranchDivision !== 'all') {
                      if ((branch.division || '').toLowerCase() !== adminBranchDivision.toLowerCase()) return false;
                    }
                    if (adminBranchDistrict !== 'all') {
                      if ((branch.district || '').toLowerCase() !== adminBranchDistrict.toLowerCase()) return false;
                    }
                    if (adminBranchUpazila !== 'all') {
                      if ((branch.upazila || '').toLowerCase() !== adminBranchUpazila.toLowerCase()) return false;
                    }
                    if (adminBranchStatus !== 'all') {
                      const isApp = branch.status === 'active' || branch.status === 'approved';
                      if (adminBranchStatus === 'active' && !isApp) return false;
                      if (adminBranchStatus === 'pending_approval' && isApp) return false;
                    }
                    if (adminBranchSearch.trim()) {
                      const q = adminBranchSearch.toLowerCase().trim();
                      const match =
                        (branch.name || '').toLowerCase().includes(q) ||
                        (branch.nameBn || '').toLowerCase().includes(q) ||
                        (branch.branchCode || '').toLowerCase().includes(q) ||
                        (branch.district || '').toLowerCase().includes(q) ||
                        (branch.upazila || '').toLowerCase().includes(q) ||
                        (branch.union || '').toLowerCase().includes(q) ||
                        (branch.managerName || '').toLowerCase().includes(q) ||
                        (branch.committeeMembers || []).some(
                          (m: any) =>
                            (m.name || '').toLowerCase().includes(q) ||
                            (m.nameBn || '').toLowerCase().includes(q) ||
                            (m.designationBn || '').toLowerCase().includes(q)
                        );
                      if (!match) return false;
                    }
                    return true;
                  })
                  .map((branch) => {
                  const isApproved = branch.status === 'active' || branch.status === 'approved';
                  const isPublished = branch.committeePublished;
                  const memberCount = branch.committeeMembers?.length || 0;

                  return (
                    <div
                      key={branch.id}
                      className={`p-5 rounded-2xl border transition ${
                        isApproved ? 'bg-slate-50/80 border-slate-200' : 'bg-amber-50/50 border-amber-200'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                              {branch.branchCode}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isApproved
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isApproved ? (isBn ? '✓ অনুমোদিত শাখা' : 'Approved Branch') : (isBn ? '⏳ আবেদন প্রক্রিয়াধীন' : 'Pending Approval')}
                            </span>
                          </div>
                          <h4 className="font-extrabold text-base text-slate-900 mt-1.5">
                            {isBn ? branch.nameBn : branch.name}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium">
                            {branch.district} | {branch.upazila || (isBn ? 'সদর' : 'Sadar')}
                          </p>
                        </div>

                        {/* Committee published badge */}
                        <div className="text-right">
                          <span
                            className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-lg ${
                              isPublished
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isPublished ? (isBn ? 'পাবলিশড কমিটি' : 'Committee Published') : (isBn ? 'কমিটি অপ্রকাশিত' : 'Draft Committee')}
                          </span>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {memberCount} {isBn ? 'জন সদস্য' : 'members'}
                          </p>
                        </div>
                      </div>

                      {/* Contact and Term Details */}
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-100 text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">{isBn ? 'ব্যবস্থাপক / সমন্বয়ক' : 'Manager'}</span>
                          <span className="font-bold text-slate-800">{isBn ? (branch.managerNameBn || branch.managerName) : branch.managerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">{isBn ? 'যোগাযোগ' : 'Phone'}</span>
                          <span className="font-mono text-slate-800">{branch.phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">{isBn ? 'কমিটির মেয়াদ' : 'Term'}</span>
                          <span className="font-bold text-emerald-700">{branch.committeeTerm || '2025-2027'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">{isBn ? 'ঠিকানা' : 'Address'}</span>
                          <span className="truncate block">{isBn ? (branch.addressBn || branch.address) : branch.address}</span>
                        </div>
                      </div>

                      {/* Committee Quick Preview Table Snippet */}
                      {branch.committeeMembers && branch.committeeMembers.length > 0 && (
                        <div className="mt-3">
                          <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex justify-between">
                            <span>{isBn ? 'কমিটি সদস্য নমুনা (ছবি ও পদবি):' : 'Key Committee Officers:'}</span>
                            <span className="text-emerald-700">{branch.committeeMembers.length} {isBn ? 'জন' : 'total'}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {branch.committeeMembers.slice(0, 4).map((m: any, idx: number) => (
                              <div key={m.id || idx} className="flex items-center gap-1.5 bg-white border border-slate-200 px-2 py-1 rounded-lg text-xs">
                                <img
                                  src={m.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                                  alt={m.name}
                                  className="w-5 h-5 rounded-full object-cover border border-slate-300"
                                />
                                <span className="font-bold text-slate-800 text-[11px]">{isBn ? m.nameBn : m.name}</span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.2 rounded font-medium">{isBn ? m.designationBn : m.designation}</span>
                              </div>
                            ))}
                            {branch.committeeMembers.length > 4 && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-lg self-center">
                                +{branch.committeeMembers.length - 4} {isBn ? 'জন আরও' : 'more'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                        {/* Primary Committee Management Button */}
                        <button
                          onClick={() => openCommitteeManagement(branch)}
                          className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{isBn ? 'কমিটি সদস্য তালিকা ও পরিচালনা' : 'Manage Committee Roster'}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {!isApproved && (
                            <button
                              onClick={() => handleApproveBranch(branch)}
                              className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{isBn ? 'অনুমোদন ও পাবলিশ' : 'Approve & Publish'}</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleTogglePublishCommittee(branch)}
                            className="flex items-center gap-1 text-slate-700 hover:text-emerald-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-bold transition"
                            title={isBn ? 'পাবলিশ স্ট্যাটাস টগল করুন' : 'Toggle publish status'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{isPublished ? (isBn ? 'হাইড' : 'Hide') : (isBn ? 'পাবলিশ' : 'Publish')}</span>
                          </button>

                          <button
                            onClick={() => openEditModal('branch', branch)}
                            className="text-slate-700 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-slate-200 transition"
                            title="Edit branch details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteItem('branch', branch.id, branch.nameBn || branch.name)}
                            className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition"
                            title="Delete branch"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* NGOS LIST VIEW */}
          {branchSubTab === 'ngos' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span>{isBn ? 'সমন্বিত এনজিও তালিকা' : 'Affiliated NGOs List'}</span>
                </h3>

                <button
                  onClick={() => openCreateModal('ngo', {
                    name: 'Prottoy Foundation',
                    nameBn: 'প্রত্যয় ফাউন্ডেশন বাংলাদেশ',
                    registrationNumber: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
                    district: 'Dhaka',
                    contactEmail: 'contact@ngo.org',
                    contactPhone: '01711223344',
                    status: 'approved'
                  })}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isBn ? 'নতুন এনজিও যুক্ত করুন' : 'Add NGO'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ngosList.map((ngo) => (
                  <div key={ngo.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{isBn ? ngo.nameBn : ngo.name}</h4>
                        <p className="text-xs text-slate-500">{ngo.name}</p>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {ngo.status || 'Approved'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p>রেজিস্ট্রেশন নং: <span className="font-mono font-bold text-slate-700">{ngo.registrationNumber}</span></p>
                      <p>হেডকোয়ার্টার জেলা: <span className="font-semibold text-slate-800">{ngo.district}</span></p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal('ngo', ngo)}
                        className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isBn ? 'এডিট' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteItem('ngo', ngo.id, ngo.nameBn || ngo.name)}
                        className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          5. TAB: DONATIONS & PHILANTHROPY TREASURY MANAGEMENT
      ======================================================== */}
      {activeTab === 'donations' && (
        <AdminDonationManager />
      )}

      {/* ========================================================
          6. TAB: BLOOD BANK & SOS
      ======================================================== */}
      {activeTab === 'blood' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Sub-Tab Navigation Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-600" />
                <span>{isBn ? 'সেন্ট্রাল ব্লাড ব্যাংক ও সমন্বয়ক ব্যবস্থাপনা' : 'Blood Bank & Donor Administration'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isBn
                  ? 'রক্তদাতা তালিকা, জরুরি হাসপাতালের SOS রিকোয়েস্ট এবং প্রতিটি শাখার ব্লাড ব্যাংক কমিটির দায়িত্বপ্রাপ্ত সমন্বয়ক পরিচালনা করুন।'
                  : 'Manage blood donors, live hospital SOS alerts, and branch blood bank coordinators roster.'}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setBloodSubTab('committee')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  bloodSubTab === 'committee'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {isBn ? 'ব্লাড কমিটি ও সমন্বয়ক' : 'Committee Roster'} ({bloodCommitteesList.length})
              </button>
              <button
                onClick={() => setBloodSubTab('donors')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  bloodSubTab === 'donors'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {isBn ? 'রক্তদাতা তালিকা' : 'Donors'} ({donorsList.length})
              </button>
              <button
                onClick={() => setBloodSubTab('sos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  bloodSubTab === 'sos'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {isBn ? 'SOS রিকোয়েস্ট' : 'SOS Requests'} ({bloodRequests.length})
              </button>
            </div>
          </div>

          {/* SUBTAB 1: BLOOD BANK COMMITTEE & COORDINATORS */}
          {bloodSubTab === 'committee' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-rose-600" />
                  <span className="font-bold text-sm text-slate-800">
                    {isBn ? 'শাখাসমূহের অনুমোদিত ব্লাড ব্যাংক ইনচার্জ ও সমন্বয়ক তালিকা' : 'Branch Blood Bank Coordinators Roster'}
                  </span>
                </div>

                <button
                  onClick={() => openCreateModal('bloodCommittee', {
                    name: 'Dr. Mahmudul Hasan',
                    nameBn: 'ডা. মাহমুদুল হাসান',
                    designation: 'District Blood Coordinator',
                    designationBn: 'জেলা ব্লাড ব্যাংক ইনচার্জ ও মেডিকেল অফিসার',
                    bloodGroup: 'O+',
                    phone: '01973817167',
                    email: 'blood@ascado.org',
                    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
                    district: 'Dhaka',
                    upazila: 'Dhanmondi',
                    branchName: 'ধানমন্ডি কেন্দ্রীয় শাখা',
                    roleType: 'branch',
                    isEmergencyLead: true,
                    status: 'active'
                  })}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isBn ? 'নতুন সমন্বয়ক যুক্ত করুন' : 'Add Blood Coordinator'}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                      <th className="py-3 px-4">ছবি ও নাম</th>
                      <th className="py-3 px-4">পদবি ও দায়িত্ব</th>
                      <th className="py-3 px-4">রক্তের গ্রুপ</th>
                      <th className="py-3 px-4">মোবাইল নম্বর</th>
                      <th className="py-3 px-4">জেলা ও শাখা</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {bloodCommitteesList.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={c.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                              alt={c.name}
                              className="w-9 h-9 rounded-full object-cover border border-slate-300 shrink-0"
                            />
                            <div>
                              <div className="font-extrabold text-slate-900">{isBn ? c.nameBn : c.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{c.email || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-rose-700">
                          {isBn ? c.designationBn : c.designation}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-extrabold text-xs bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-md">
                            {c.bloodGroup || 'O+'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{c.phone}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800">{c.branchName || `${c.district} Branch`}</span>
                          <span className="block text-[10px] text-slate-400">{c.district}, {c.upazila}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {c.status === 'active' ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Inactive')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => openEditModal('bloodCommittee', c)}
                            className="text-emerald-700 hover:text-emerald-800 p-1 font-bold inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{isBn ? 'এডিট' : 'Edit'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem('bloodCommittee', c.id, c.nameBn || c.name)}
                            className="text-rose-600 hover:text-rose-700 p-1 font-bold inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUBTAB 2: BLOOD DONORS LIST */}
          {bloodSubTab === 'donors' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className="font-bold text-sm text-slate-800">
                  {isBn ? 'সক্রিয় ও নিবন্ধিত রক্তদাতা তালিকা' : 'Registered Blood Donors'}
                </span>

                <button
                  onClick={() => openCreateModal('donor', {
                    fullName: 'Md. Al Amin',
                    bloodGroup: 'O+',
                    phone: '01711223344',
                    district: 'Dhaka',
                    upazila: 'Mirpur',
                    isAvailable: true,
                    lastDonationDate: '2026-05-10',
                    donationCount: 5
                  })}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isBn ? 'নতুন রক্তদাতা যুক্ত করুন' : 'Add Blood Donor'}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                      <th className="py-3 px-4">নাম</th>
                      <th className="py-3 px-4">রক্তের গ্রুপ</th>
                      <th className="py-3 px-4">মোবাইল</th>
                      <th className="py-3 px-4">জেলা / উপজেলা</th>
                      <th className="py-3 px-4">সর্বশেষ রক্তদান</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {donorsList.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{d.fullName}</td>
                        <td className="py-3 px-4">
                          <span className="font-extrabold text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md">
                            {d.bloodGroup}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">{d.phone}</td>
                        <td className="py-3 px-4">{d.district}, {d.upazila}</td>
                        <td className="py-3 px-4 text-slate-500">{d.lastDonationDate || 'N/A'}</td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          <button
                            onClick={() => openEditModal('donor', d)}
                            className="text-emerald-700 hover:text-emerald-800 p-1 font-bold inline-flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{isBn ? 'এডিট' : 'Edit'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteItem('donor', d.id, d.fullName)}
                            className="text-rose-600 hover:text-rose-700 p-1 font-bold inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUBTAB 3: LIVE SOS REQUESTS */}
          {bloodSubTab === 'sos' && (
            <div className="space-y-4">
              <span className="font-bold text-sm text-slate-800">
                {isBn ? 'জরুরি রক্তের চাহিদা ও হাসপাতালের রিকোয়েস্ট' : 'Live Blood SOS Queue'}
              </span>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                      <th className="py-3 px-4">রোগী ও হাসপাতাল</th>
                      <th className="py-3 px-4">রক্তের গ্রুপ</th>
                      <th className="py-3 px-4">প্রয়োজনীয় ব্যাগ</th>
                      <th className="py-3 px-4">যোগাযোগ</th>
                      <th className="py-3 px-4">জরুরিতা</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {bloodRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{r.patientName}</div>
                          <div className="text-[10px] text-slate-400">{r.hospitalName}, {r.district}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-extrabold text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md">
                            {r.bloodGroup}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">{r.unitsNeeded} ব্যাগ ({r.requiredDate})</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{r.contactPerson}</div>
                          <div className="font-mono text-slate-500">{r.contactPhone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full uppercase">
                            {r.urgency || 'Emergency'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            {r.status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteItem('bloodRequest', r.id, r.patientName)}
                            className="text-rose-600 hover:text-rose-700 p-1 font-bold inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          7. TAB: SCHOOL & VOCATIONAL COURSES
      ======================================================== */}
      {activeTab === 'school' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <span>{isBn ? 'স্কুল, মাদ্রাসা ও কারিগরি কোর্স ম্যানেজমেন্ট' : 'School & Vocational Courses'}</span>
            </h3>

            <button
              onClick={() => openCreateModal('course', {
                title: 'Professional Web Development & React',
                titleBn: 'প্রফেশনাল ওয়েব ডেভেলপমেন্ট ও ফ্রিল্যান্সিং কোর্স',
                instructor: 'Engr. Tanvir Ahmed',
                duration: '৩ মাস (৩৬ ক্লাস)',
                category: 'ICT & Technology',
                fee: 1500,
                rating: 5.0
              })}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isBn ? 'নতুন কোর্স যুক্ত করুন' : 'Add Course'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coursesList.map((c) => (
              <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">{c.category}</span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">{isBn ? c.titleBn : c.title}</h4>
                  </div>
                  <span className="text-xs font-black text-emerald-700">৳ {c.fee}</span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>প্রশিক্ষক: <span className="font-semibold text-slate-800">{c.instructor}</span></p>
                  <p>মেয়াদ: {c.duration}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal('course', c)}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'এডিট' : 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteItem('course', c.id, c.titleBn || c.title)}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          8. TAB: SOMITI & MICRO-LOANS
      ======================================================== */}
      {activeTab === 'somiti' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-600" />
              <span>{isBn ? 'ক্ষুদ্রঋণ সমিতি ও কিস্তি রেকর্ড' : 'Somiti Micro-loans & Installments'}</span>
            </h3>

            <button
              onClick={() => openCreateModal('loan', {
                borrowerName: 'Fatema Begum',
                loanAmount: 30000,
                interestRate: 6,
                termMonths: 12,
                monthlyInstallment: 2650,
                dueAmount: 31800,
                status: 'approved',
                purpose: 'পোল্ট্রি খামার সম্প্রসারণ'
              })}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isBn ? 'নতুন ঋণ যুক্ত করুন' : 'Add Loan Record'}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="py-3 px-4">গ্রহীতার নাম</th>
                  <th className="py-3 px-4">ঋণের পরিমাণ</th>
                  <th className="py-3 px-4">মাসিক কিস্তি</th>
                  <th className="py-3 px-4">অবশিষ্ট বকেয়া</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loansList.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{l.borrowerName}</td>
                    <td className="py-3 px-4 font-black text-slate-800">৳ {Number(l.loanAmount || 0).toLocaleString()}</td>
                    <td className="py-3 px-4">৳ {Number(l.monthlyInstallment || 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">৳ {Number(l.dueAmount || 0).toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => openEditModal('loan', l)}
                        className="text-emerald-700 hover:text-emerald-800 p-1 font-bold inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isBn ? 'এডিট' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteItem('loan', l.id, l.borrowerName)}
                        className="text-rose-600 hover:text-rose-700 p-1 font-bold inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          9. TAB: MARKETPLACE PRODUCTS (১০% কমিশন)
      ======================================================== */}
      {activeTab === 'marketplace' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <span>{isBn ? 'মার্কেটপ্লেস পণ্য ও ১০% কমিশন ম্যানেজমেন্ট' : 'Marketplace & 10% Commission'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn ? 'প্রতিটি বিক্রয়ে প্ল্যাটফর্ম ১০% কমিশন স্বয়ংক্রিয়ভাবে হিসাব করে।' : 'Platform automatically retains 10% gross commission per transaction.'}
              </p>
            </div>

            <button
              onClick={() => openCreateModal('product', {
                name: 'Organic Mustard Oil 1 Litre',
                nameBn: 'ঘানিভাঙ্গা খাঁটি সরিষার তেল ১ লিটার',
                price: 320,
                stock: 50,
                sellerName: 'Natore Organic Agro Farm',
                platformCommissionRate: 0.10,
                verified: true
              })}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isBn ? 'নতুন পণ্য যুক্ত করুন' : 'Add Product'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productsList.map((p) => (
              <div key={p.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{isBn ? p.nameBn : p.name}</h4>
                    <p className="text-xs text-slate-500">বিক্রেতা: {p.sellerName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-700">৳ {p.price}</span>
                    <span className="block text-[10px] text-slate-500">স্টক: {p.stock}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-50 rounded-lg text-xs flex justify-between">
                  <span className="text-emerald-800 font-medium">প্ল্যাটফর্ম কমিশন (১০%):</span>
                  <span className="font-bold text-emerald-900">৳ {Math.round(p.price * (p.platformCommissionRate || 0.10))}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal('product', p)}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'এডিট' : 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteItem('product', p.id, p.nameBn || p.name)}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          10. TAB: REAL ESTATE LISTINGS
      ======================================================== */}
      {activeTab === 'realestate' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Home className="w-5 h-5 text-emerald-600" />
              <span>{isBn ? 'রিয়েল এস্টেট ও ভেরিফাইড প্রপার্টি তালিকা' : 'Real Estate Listings & Legal Verification'}</span>
            </h3>

            <button
              onClick={() => openCreateModal('property', {
                title: '3 Bed Apartment for Rent in Uttara Sector 11',
                titleBn: 'উত্তরা সেক্টর ১১-তে ৩ বেডের লাক্সারি ফ্ল্যাট ভাড়া',
                price: 25000,
                location: 'Uttara, Dhaka',
                type: 'rent',
                bedrooms: 3,
                bathrooms: 3,
                areaSqFt: 1450,
                isLegallyVerified: true,
                status: 'available'
              })}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isBn ? 'নতুন প্রপার্টি যুক্ত করুন' : 'Add Property'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {propertiesList.map((prop) => (
              <div key={prop.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{prop.type === 'rent' ? 'ভাড়া (Rent)' : 'বিক্রয় (Sale)'}</span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">{isBn ? prop.titleBn : prop.title}</h4>
                  </div>
                  <span className="text-xs font-black text-emerald-700">৳ {Number(prop.price || 0).toLocaleString()}</span>
                </div>

                <div className="text-xs text-slate-600">
                  <p>লোকেশন: {prop.location}</p>
                  <p>সাইজ: {prop.areaSqFt} বর্গফুট • {prop.bedrooms} বেড • {prop.bathrooms} বাথ</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    prop.isLegallyVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {prop.isLegallyVerified ? '✓ Verified' : 'Pending Verification'}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal('property', prop)}
                      className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isBn ? 'এডিট' : 'Edit'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteItem('property', prop.id, prop.titleBn || prop.title)}
                      className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          11. TAB: MATRIMONIAL BIODATAS
      ======================================================== */}
      {activeTab === 'marriage' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <span>{isBn ? 'ম্যারেজ মিডিয়া ও পাত্র-পাত্রী বায়োডাটা' : 'Matrimonial Profiles & Biodatas'}</span>
            </h3>

            <button
              onClick={() => openCreateModal('marriage', {
                candidateCode: `ASC-${Math.floor(100 + Math.random() * 900)}`,
                gender: 'bride',
                religion: 'Islam',
                age: 24,
                education: 'BSc in CSE',
                profession: 'Software Engineer',
                district: 'Dhaka',
                status: 'active'
              })}
              className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isBn ? 'নতুন বায়োডাটা যুক্ত করুন' : 'Add Biodata'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {marriageList.map((m) => (
              <div key={m.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-pink-700">{m.candidateCode}</span>
                  <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-full">
                    {m.gender === 'bride' ? 'পাত্রী' : 'পাত্র'}
                  </span>
                </div>
                <p><span className="font-bold">বয়স:</span> {m.age} বছর</p>
                <p><span className="font-bold">পেশা:</span> {m.profession}</p>
                <p><span className="font-bold">শিক্ষা:</span> {m.education}</p>
                <p><span className="font-bold">জেলা:</span> {m.district}</p>

                <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    onClick={() => openEditModal('marriage', m)}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'এডিট' : 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteItem('marriage', m.id, m.candidateCode)}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          12. TAB: NOTICES & CMS
      ======================================================== */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-600" />
              <span>{isBn ? 'অফিসিয়াল নোটিশ ও বিজ্ঞপ্তি ম্যানেজমেন্ট' : 'Notices & Announcements'}</span>
            </h3>

            <button
              onClick={() => openCreateModal('notice', {
                title: 'New Branch Application Window Open',
                titleBn: '২০২৬ অর্থবছরের জন্য নতুন শাখা অন্তর্ভুক্তি আবেদন আহ্বান',
                category: 'General',
                isUrgent: false
              })}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isBn ? 'নতুন নোটিশ যুক্ত করুন' : 'Add Notice'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {noticesList.map((n) => (
              <div key={n.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded-md uppercase">
                      {n.category}
                    </span>
                    {n.isUrgent && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-md">
                        জরুরি
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">{n.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{isBn ? n.titleBn : n.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal('notice', n)}
                    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold text-xs p-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'এডিট' : 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => handleDeleteItem('notice', n.id, n.titleBn || n.title)}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold text-xs p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          13. TAB: SYSTEM SETTINGS & MASTER CONTROL
      ======================================================== */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Settings Sub-Tab Navigation Header */}
          <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>{isBn ? 'সেন্ট্রাল সিস্টেম ও কন্ট্রোল সেন্টার' : 'Enterprise Control & Settings Hub'}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                      {isBn ? 'মাস্টার মোড' : 'Master Mode'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn ? 'মেনু তৈরি, পেজ লিংক, মডিউল সুইচ, ব্র্যান্ডিং ও ডাটাবেজ এক ক্লিকে সম্পূর্ণ নিয়ন্ত্রণ করুন' : 'Manage navigation menus, modules toggle, branding, payment gateways, and central database'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isBn ? 'ব্যাকআপ ডাউনলোড' : 'Download Backup'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSystemReset}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isBn ? 'ক্যাশ সিঙ্ক' : 'Sync State'}</span>
                </button>
              </div>
            </div>

            {/* Sub-Tabs Pills */}
            <div className="flex flex-wrap gap-2 pt-4">
              {[
                { id: 'hubs_branding', label: isBn ? '🏛️ ১২টি হাব ও মিনি পোর্টাল ব্র্যান্ডিং' : 'Hubs Mini Portals Branding', icon: Sparkles },
                { id: 'menus', label: isBn ? '🧭 মেনু ও নেভিগেশন বিল্ডার' : 'Navigation Menus', icon: Layers },
                { id: 'modules', label: isBn ? '🎛️ মডিউল পাওয়ার সুইচ' : 'Feature Modules', icon: Sliders },
                { id: 'branding', label: isBn ? '🏛️ সেন্ট্রাল ব্র্যান্ডিং ও পরিচিতি' : 'Central NGO Branding', icon: Globe },
                { id: 'payments', label: isBn ? '💳 পেমেন্ট গেটওয়ে ও হিসাব' : 'Payment Gateways', icon: DollarSign },
                { id: 'social', label: isBn ? '🌐 সোশ্যাল মিডিয়া ও লিঙ্ক' : 'Social & Links', icon: Share2 },
                { id: 'database', label: isBn ? '🗄️ ডাটাবেজ মাস্টার হাব' : 'Database Master', icon: Database },
              ].map(sub => {
                const SubIcon = sub.icon;
                const isActive = settingsSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSettingsSubTab(sub.id as SettingsSubTab)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              SUB-TAB 0: MULTI-NGO HUBS & MINI PORTALS BRANDING MANAGER
          ======================================================== */}
          {settingsSubTab === 'hubs_branding' && (
            <HubAdminBrandingManager />
          )}

          {/* ========================================================
              SUB-TAB 1: DYNAMIC NAVIGATION MENUS & BUILDER
          ======================================================== */}
          {settingsSubTab === 'menus' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600" />
                    <span>{isBn ? 'ডায়নামিক মেনু ও হেডার নেভিগেশন নিয়ন্ত্রণ' : 'Dynamic Menus & Navigation Builder'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn ? 'হেডার, ড্রপডাউন এবং ফুটারের মেনু যোগ করুন, সাজান, এডিট করুন বা মুছে ফেলুন।' : 'Create, edit, toggle visibility, and delete items from header, dropdowns, and footer.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenCreateMenu('header_main')}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isBn ? 'নতুন মেনু তৈরি করুন' : 'Create New Menu'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetMenus}
                    className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3.5 py-2.5 rounded-xl transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isBn ? 'ডিফল্ট মেনু রিস্টোর' : 'Reset Defaults'}</span>
                  </button>
                </div>
              </div>

              {/* Menu Categories Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    cat: 'header_main',
                    title: isBn ? 'মেইন হেডার মেনু' : 'Header Main Menu',
                    desc: isBn ? 'টপবারে সরাসরি প্রদর্শিত লিংকসমূহ' : 'Direct topbar links',
                    badge: 'Header',
                    color: 'emerald'
                  },
                  {
                    cat: 'programs',
                    title: isBn ? 'কর্মসূচি ড্রপডাউন' : 'Programs Dropdown',
                    desc: isBn ? 'সেবামূলক ও উন্নয়ন কর্মসূচির লিংকসমূহ' : 'Welfare & development programs',
                    badge: 'Programs',
                    color: 'blue'
                  },
                  {
                    cat: 'economic',
                    title: isBn ? 'অর্থনৈতিক শাখা ড্রপডাউন' : 'Economic Dropdown',
                    desc: isBn ? 'সমিতি, মার্কেটপ্লেস, রিয়েল এস্টেট' : 'Somiti, marketplace, real estate',
                    badge: 'Economic',
                    color: 'amber'
                  }
                ].map(section => {
                  const items = (menusList || []).filter(m => m && m.category === section.cat).sort((a, b) => (a.order || 0) - (b.order || 0));
                  return (
                    <div key={section.cat} className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-xs text-slate-800">{section.title}</span>
                          <p className="text-[11px] text-slate-500">{section.desc}</p>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                          {items.length} {isBn ? 'মেনু' : 'items'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleOpenCreateMenu(section.cat as any)}
                        className="w-full py-1.5 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>{isBn ? '+ এই সেকশনে মেনু যোগ' : '+ Add to section'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Table of All Menus */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                      <th className="py-3 px-4">অর্ডার</th>
                      <th className="py-3 px-4">ক্যাটাগরি</th>
                      <th className="py-3 px-4">মেনুর নাম (বাংলা / EN)</th>
                      <th className="py-3 px-4">টার্গেট পেজ / রুট</th>
                      <th className="py-3 px-4">ব্যাজ</th>
                      <th className="py-3 px-4">অবস্থা</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন ও নিয়ন্ত্রণ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {menusList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          {isBn ? 'কোনো মেনু পাওয়া যায়নি।' : 'No navigation menus found.'}
                        </td>
                      </tr>
                    ) : (
                      menusList
                        .sort((a, b) => {
                          if (a.category !== b.category) return a.category.localeCompare(b.category);
                          return (a.order || 0) - (b.order || 0);
                        })
                        .map(menu => (
                          <tr key={menu.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 px-4 font-mono font-bold text-slate-500">
                              #{menu.order}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                menu.category === 'header_main'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : menu.category === 'programs'
                                  ? 'bg-blue-100 text-blue-800'
                                  : menu.category === 'economic'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}>
                                {menu.category.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900 text-xs">
                                {menu.titleBn || menu.title}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {menu.title} {menu.iconName && `• (${menu.iconName})`}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                                {menu.isExternal ? (
                                  <span className="flex items-center gap-1">
                                    <ExternalLink className="w-3 h-3" /> {menu.externalUrl}
                                  </span>
                                ) : (
                                  `/${menu.route}`
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {menu.badgeBn || menu.badge ? (
                                <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                  {menu.badgeBn || menu.badge}
                                </span>
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                type="button"
                                onClick={() => handleToggleMenu(menu.id)}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                                  menu.isActive !== false
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                }`}
                              >
                                {menu.isActive !== false ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>{isBn ? 'সক্রিয় (Active)' : 'Active'}</span>
                                  </>
                                ) : (
                                  <>
                                    <X className="w-3 h-3 text-slate-500" />
                                    <span>{isBn ? 'লুকানো (Hidden)' : 'Hidden'}</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditMenu(menu)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  title={isBn ? 'এডিট করুন' : 'Edit Menu'}
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMenu(menu.id, menu.titleBn || menu.title)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                  title={isBn ? 'মুছে ফেলুন' : 'Delete Menu'}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              SUB-TAB 2: MASTER FEATURE MODULE SWITCHES
          ======================================================== */}
          {settingsSubTab === 'modules' && settingsData && (
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div>
                  <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-600" />
                    <span>{isBn ? 'সেন্ট্রাল মডিউল পাওয়ার সুইচ ও পলিসি কন্ট্রোল' : 'Feature Modules Switch & Policies'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn ? 'প্রয়োজন অনুযায়ী যেকোনো সার্ভিস বা মডিউল অন/অফ করুন এবং পলিসি কনফিগার করুন।' : 'Enable or disable enterprise modules across the entire portal.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 'branches', nameBn: 'শাখা ও কার্যনির্বাহী কমিটি', nameEn: 'Branches & Committees', descBn: '৬৪ জেলা ও উপজেলা শাখা নেটওয়ার্ক', icon: Building2 },
                    { id: 'donations', nameBn: 'দান ও যাকাত তহবিল', nameEn: 'Donations & Zakat Fund', descBn: 'অনলাইন অনুদান ও যাকাত ক্যালকুলেটর', icon: Heart },
                    { id: 'blood', nameBn: 'ব্লাড ব্যাংক ও SOS রিকোয়েস্ট', nameEn: 'Blood Bank & SOS Requests', descBn: 'রক্তদাতা রেজিস্ট্রি ও জরুরি রক্তের আবেদন', icon: HeartPulse },
                    { id: 'school', nameBn: 'এসকাডো একাডেমি ও ডিজিটাল স্কুল', nameEn: 'Digital School & Academy', descBn: 'অনলাইন ক্লাস, ব্যাচ ও সার্টিফিকেট ভেরিফিকেশন', icon: GraduationCap },
                    { id: 'somiti', nameBn: 'সমিতি ও সুদমুক্ত ক্ষুদ্রঋণ', nameEn: 'Somiti & Microfinance', descBn: 'সঞ্চয় হিসাব, ক্ষুদ্রঋণ আবেদন ও কিস্তি ট্র্যাকিং', icon: Landmark },
                    { id: 'marketplace', nameBn: 'হালাল মার্কেটপ্লেস ও হস্তশিল্প', nameEn: 'Halal Marketplace & Artisans', descBn: 'উদ্যোক্তাদের পণ্য প্রদর্শনী ও অর্ডার ম্যানেজমেন্ট', icon: ShoppingBag },
                    { id: 'realestate', nameBn: 'যাচাইকৃত জমি ও রিয়েল এস্টেট', nameEn: 'Verified Real Estate & Land', descBn: 'নিরাপদ প্রপার্টি ও আবাসন লিস্টিং', icon: Home },
                    { id: 'marriage', nameBn: 'পাত্র-পাত্রী ম্যারেজ মিডিয়া', nameEn: 'Marriage Media & Matrimony', descBn: 'ইসলামিক ও নিরাপদ বৈবাহিক বায়োডাটা প্রোফাইল', icon: Heart },
                    { id: 'notices', nameBn: 'নোটিশ বোর্ড ও প্রেস রিলিজ', nameEn: 'Notice Board & Press Releases', descBn: 'অফিশিয়াল সার্কুলার ও নোটিশ পাবলিকেশন', icon: Bell },
                  ].map(mod => {
                    const ModIcon = mod.icon;
                    const isEnabled = settingsData.modules?.[mod.id]?.enabled !== false;
                    return (
                      <div
                        key={mod.id}
                        className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                          isEnabled
                            ? 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                            : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                              <ModIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900">{isBn ? mod.nameBn : mod.nameEn}</div>
                              <div className="text-[10px] text-slate-500 line-clamp-1">{mod.descBn}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className={`text-[11px] font-bold ${isEnabled ? 'text-emerald-700' : 'text-slate-400'}`}>
                            {isEnabled ? (isBn ? 'সক্রিয় (Enabled)' : 'Enabled') : (isBn ? 'নিষ্ক্রিয় (Disabled)' : 'Disabled')}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={e => setSettingsData({
                                ...settingsData,
                                modules: {
                                  ...settingsData.modules,
                                  [mod.id]: {
                                    ...(settingsData.modules?.[mod.id] || {}),
                                    enabled: e.target.checked
                                  }
                                }
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isBn ? 'মডিউল কনফিগারেশন সংরক্ষণ করুন' : 'Save Module Configuration'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ========================================================
              SUB-TAB 3: BRANDING & ORGANIZATIONAL INFO
          ======================================================== */}
          {settingsSubTab === 'branding' && settingsData && (
            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div>
                  <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-600" />
                    <span>{isBn ? 'ওয়েবসাইট ব্র্যান্ডিং, স্লোগান ও পরিচিতি' : 'Site Branding & Identity'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn ? 'ওয়েবসাইটের অফিসিয়াল নাম, হটলাইন, স্লোগান ও নোটিশ টিকার পরিচালনা করুন।' : 'Manage official titles, slogans, hotline, and live ticker notices.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">{isBn ? 'সংস্থার নাম (বাংলা)' : 'Organization Name (Bangla)'}</label>
                    <input
                      value={settingsData.general?.siteNameBn || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        general: { ...settingsData.general, siteNameBn: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl"
                      placeholder="এসকাডো এনজিও ফাউন্ডেশন"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">{isBn ? 'সংস্থার নাম (English)' : 'Organization Name (English)'}</label>
                    <input
                      value={settingsData.general?.siteName || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        general: { ...settingsData.general, siteName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl"
                      placeholder="ASCAHDO NGO Foundation"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700">{isBn ? 'অফিসিয়াল হটলাইন ফোন' : 'Official Hotline'}</label>
                    <input
                      value={settingsData.general?.helpline || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        general: { ...settingsData.general, helpline: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                      placeholder="01813817167"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">{isBn ? 'জরুরি রক্ত ও SOS হেল্পলাইন' : 'Emergency SOS Helpline'}</label>
                    <input
                      value={settingsData.general?.emergencyPhone || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        general: { ...settingsData.general, emergencyPhone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                      placeholder="01813817167"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1 text-slate-700">{isBn ? 'অফিসিয়াল সাপোর্ট ইমেইল' : 'Official Support Email'}</label>
                    <input
                      value={settingsData.general?.supportEmail || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        general: { ...settingsData.general, supportEmail: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl"
                      placeholder="ascahdo@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">{isBn ? 'নিবন্ধন নম্বর ও প্রতিষ্ঠার সাল' : 'Registration No & Est. Year'}</label>
                    <input
                      value={settingsData.general?.regNumber || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        general: { ...settingsData.general, regNumber: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl"
                      placeholder="Reg: NGO-88239/2012"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1 text-slate-700">{isBn ? 'হেড অফিস ঠিকানা (বাংলা)' : 'Central Head Office (Bangla)'}</label>
                    <input
                      value={settingsData.general?.headOfficeAddressBn || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        general: { ...settingsData.general, headOfficeAddressBn: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl"
                      placeholder="সেন্ট্রাল ভবন, ঢাকা, বাংলাদেশ"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1 text-slate-700">{isBn ? 'হোমপেজ লাইভ নোটিশ টিকার (Ticker Announcement)' : 'Live Notice Ticker Announcement'}</label>
                    <input
                      value={settingsData.general?.announcementTicker || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        general: { ...settingsData.general, announcementTicker: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl"
                      placeholder="জরুরি বিজ্ঞপ্তি: দেশব্যাপী শীতবস্ত্র বিতরণ ও বিনামূল্যে রক্তদান কর্মসূচি চলছে..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isBn ? 'ব্র্যান্ডিং সেটিংস সংরক্ষণ করুন' : 'Save Branding Settings'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ========================================================
              SUB-TAB 4: PAYMENT GATEWAYS & FINANCIAL ACCOUNTS
          ======================================================== */}
          {settingsSubTab === 'payments' && settingsData && (
            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div>
                  <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    <span>{isBn ? 'পেমেন্ট গেটওয়ে, মার্চেন্ট নম্বর ও ব্যাংক হিসাব' : 'Payment Gateways & Banking Details'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn ? 'বিকাশ, নগদ, রকেট এবং সেন্ট্রাল ব্যাংক অ্যাকাউন্ট নম্বর পরিচালনা করুন।' : 'Configure merchant accounts and banking details for donations and marketplace.'}
                  </p>
                </div>

                {/* Mobile Financial Services (MFS) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-pink-50/70 border border-pink-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-pink-800 text-sm">বিকাশ (bKash)</span>
                      <span className="text-[10px] bg-pink-200 text-pink-900 font-bold px-2 py-0.5 rounded-full">মার্চেন্ট</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-pink-900 mb-1">মার্চেন্ট / পেমেন্ট নম্বর</label>
                      <input
                        value={settingsData.paymentGateways?.bkash?.merchantNumber || ''}
                        onChange={e => setSettingsData({
                          ...settingsData,
                          paymentGateways: {
                            ...settingsData.paymentGateways,
                            bkash: { ...settingsData.paymentGateways?.bkash, merchantNumber: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-mono"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-800 text-sm">নগদ (Nagad)</span>
                      <span className="text-[10px] bg-orange-200 text-orange-900 font-bold px-2 py-0.5 rounded-full">মার্চেন্ট</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-orange-900 mb-1">মার্চেন্ট / পেমেন্ট নম্বর</label>
                      <input
                        value={settingsData.paymentGateways?.nagad?.merchantNumber || ''}
                        onChange={e => setSettingsData({
                          ...settingsData,
                          paymentGateways: {
                            ...settingsData.paymentGateways,
                            nagad: { ...settingsData.paymentGateways?.nagad, merchantNumber: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-mono"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-800 text-sm">রকেট (Rocket)</span>
                      <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-2 py-0.5 rounded-full">মার্চেন্ট</span>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-purple-900 mb-1">মার্চেন্ট / পেমেন্ট নম্বর</label>
                      <input
                        value={settingsData.paymentGateways?.rocket?.merchantNumber || ''}
                        onChange={e => setSettingsData({
                          ...settingsData,
                          paymentGateways: {
                            ...settingsData.paymentGateways,
                            rocket: { ...settingsData.paymentGateways?.rocket, merchantNumber: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-mono"
                        placeholder="01XXXXXXXXX-X"
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Account Details */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                  <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wide">
                    {isBn ? 'অফিসিয়াল সেন্ট্রাল ব্যাংক অ্যাকাউন্ট তথ্য' : 'Official Central Bank Account Details'}
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">ব্যাংকের নাম</label>
                      <input
                        value={settingsData.paymentGateways?.bank?.bankName || ''}
                        onChange={e => setSettingsData({
                          ...settingsData,
                          paymentGateways: {
                            ...settingsData.paymentGateways,
                            bank: { ...settingsData.paymentGateways?.bank, bankName: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border rounded-xl bg-white"
                        placeholder="Islami Bank Bangladesh Ltd"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">অ্যাকাউন্ট শিরোনাম</label>
                      <input
                        value={settingsData.paymentGateways?.bank?.accountName || ''}
                        onChange={e => setSettingsData({
                          ...settingsData,
                          paymentGateways: {
                            ...settingsData.paymentGateways,
                            bank: { ...settingsData.paymentGateways?.bank, accountName: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border rounded-xl bg-white"
                        placeholder="ASCAHDO Foundation"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">হিসাব নম্বর (A/C No)</label>
                      <input
                        value={settingsData.paymentGateways?.bank?.accountNumber || ''}
                        onChange={e => setSettingsData({
                          ...settingsData,
                          paymentGateways: {
                            ...settingsData.paymentGateways,
                            bank: { ...settingsData.paymentGateways?.bank, accountNumber: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-mono"
                        placeholder="2050XXXXXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-slate-700">শাখা ও রাউটিং নম্বর</label>
                      <input
                        value={settingsData.paymentGateways?.bank?.branchAndRouting || ''}
                        onChange={e => setSettingsData({
                          ...settingsData,
                          paymentGateways: {
                            ...settingsData.paymentGateways,
                            bank: { ...settingsData.paymentGateways?.bank, branchAndRouting: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border rounded-xl bg-white"
                        placeholder="Principal Branch, Routing: 12527..."
                      />
                    </div>
                  </div>
                </div>

                {/* Rates & Commission */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">{isBn ? 'মার্কেটপ্লেস ডিফল্ট কমিশন (%)' : 'Marketplace Default Commission (%)'}</label>
                    <input
                      type="number"
                      value={settingsData.general?.defaultCommissionRate || 10}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        general: { ...settingsData.general, defaultCommissionRate: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">{isBn ? 'ক্ষুদ্রঋণ সমিতি প্রসেসিং ফি / সার্ভিস চার্জ (%)' : 'Somiti Loan Service Charge (%)'}</label>
                    <input
                      type="number"
                      value={settingsData.general?.somitiServiceFee || 0}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        general: { ...settingsData.general, somitiServiceFee: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isBn ? 'পেমেন্ট সেটিংস সংরক্ষণ করুন' : 'Save Payment Gateways'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ========================================================
              SUB-TAB 5: SOCIAL MEDIA & COMMUNITY HANDLES
          ======================================================== */}
          {settingsSubTab === 'social' && settingsData && (
            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div>
                  <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-emerald-600" />
                    <span>{isBn ? 'সোশ্যাল মিডিয়া ও অফিশিয়াল কমিউনিটি লিংক' : 'Official Social Channels & Links'}</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn ? 'ফুটার ও হেডারে প্রদর্শিত সোশ্যাল চ্যানেলের লিংক পরিচালনা করুন।' : 'Configure direct links to Facebook, YouTube, WhatsApp, and Telegram.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Facebook Page URL</label>
                    <input
                      value={settingsData.social?.facebook || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        social: { ...settingsData.social, facebook: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                      placeholder="https://facebook.com/ascahdo"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">YouTube Channel URL</label>
                    <input
                      value={settingsData.social?.youtube || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        social: { ...settingsData.social, youtube: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                      placeholder="https://youtube.com/@ascahdo"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">WhatsApp Helpline Link</label>
                    <input
                      value={settingsData.social?.whatsapp || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        social: { ...settingsData.social, whatsapp: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                      placeholder="https://wa.me/8801813817167"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">LinkedIn Official Page</label>
                    <input
                      value={settingsData.social?.linkedin || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        social: { ...settingsData.social, linkedin: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                      placeholder="https://linkedin.com/company/ascahdo"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Twitter / X Handle</label>
                    <input
                      value={settingsData.social?.twitter || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        social: { ...settingsData.social, twitter: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                      placeholder="https://x.com/ascahdo"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-slate-700">Telegram Channel URL</label>
                    <input
                      value={settingsData.social?.telegram || ''}
                      onChange={e => setSettingsData({
                        ...settingsData,
                        social: { ...settingsData.social, telegram: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                      placeholder="https://t.me/ascahdo"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isBn ? 'সোশ্যাল লিংক সংরক্ষণ করুন' : 'Save Social Channels'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ========================================================
              SUB-TAB 6: CENTRAL DATABASE MASTER HUB & BACKUP
          ======================================================== */}
          {settingsSubTab === 'database' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div>
                <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600" />
                  <span>{isBn ? 'সেন্ট্রাল ডাটাবেজ মাস্টার কন্ট্রোল ও ব্যাকআপ হাব' : 'Central Database Hub & Quick Control'}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn ? 'সকল ১৪টি ডাটাবেজ টেবিলের লাইভ রেকর্ড সংখ্যা এবং তাৎক্ষণিক নিয়ন্ত্রণ।' : 'Live overview and management of all 14 data collections in the system.'}
                </p>
              </div>

              {/* Entity Count Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {[
                  { label: isBn ? 'ইউজার' : 'Users', count: usersList.length, type: 'user', icon: Users, tab: 'users' },
                  { label: isBn ? 'শাখা' : 'Branches', count: branchesList.length, type: 'branch', icon: Building2, tab: 'ngos' },
                  { label: isBn ? 'এনজিও' : 'NGOs', count: ngosList.length, type: 'ngo', icon: Building2, tab: 'ngos' },
                  { label: isBn ? 'ক্যাম্পেইন' : 'Campaigns', count: campaignsList.length, type: 'campaign', icon: Heart, tab: 'donations' },
                  { label: isBn ? 'রক্তদাতা' : 'Donors', count: donorsList.length, type: 'donor', icon: HeartPulse, tab: 'blood' },
                  { label: isBn ? 'কোর্স' : 'Courses', count: coursesList.length, type: 'course', icon: BookOpen, tab: 'school' },
                  { label: isBn ? 'শিক্ষার্থী' : 'Students', count: studentsList.length, type: 'student', icon: GraduationCap, tab: 'school' },
                  { label: isBn ? 'ঋণ আবেদন' : 'Loans', count: loansList.length, type: 'loan', icon: Landmark, tab: 'somiti' },
                  { label: isBn ? 'পণ্য' : 'Products', count: productsList.length, type: 'product', icon: ShoppingBag, tab: 'marketplace' },
                  { label: isBn ? 'প্রপার্টি' : 'Properties', count: propertiesList.length, type: 'property', icon: Home, tab: 'realestate' },
                  { label: isBn ? 'পাত্র-পাত্রী' : 'Matrimony', count: marriageList.length, type: 'marriage', icon: Heart, tab: 'marriage' },
                  { label: isBn ? 'নোটিশ' : 'Notices', count: noticesList.length, type: 'notice', icon: Bell, tab: 'notices' },
                  { label: isBn ? 'স্লাইডার' : 'Slides', count: heroSlides.length, type: 'slide', icon: Sliders, tab: 'slides' },
                  { label: isBn ? 'মেনু' : 'Menus', count: menusList.length, type: 'menu', icon: Layers, tab: 'settings' },
                ].map(ent => {
                  const EntIcon = ent.icon;
                  return (
                    <div key={ent.label} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <EntIcon className="w-4 h-4 text-emerald-600" />
                        <span className="font-mono font-bold text-slate-900 text-sm">{ent.count}</span>
                      </div>
                      <div className="font-bold text-[11px] text-slate-700 truncate">{ent.label}</div>
                      <button
                        onClick={() => {
                          if (ent.type === 'menu') {
                            setSettingsSubTab('menus');
                          } else {
                            openCreateModal(ent.type);
                          }
                        }}
                        className="w-full py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 bg-white border border-emerald-200 rounded-lg transition"
                      >
                        + {isBn ? 'নতুন যোগ' : 'Add New'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Central Backup & State Sync Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-600">
                  <span className="font-bold">{isBn ? 'সেন্ট্রাল স্টোরেজ স্টেটাস:' : 'Storage Status:'}</span>{' '}
                  <span className="text-emerald-700 font-bold">{isBn ? 'অনলাইন ও সক্রিয়' : 'Online & Active'}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isBn ? 'সম্পূর্ণ ডাটাবেজ ব্যাকআপ (JSON)' : 'Full Database Backup (JSON)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSystemReset}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{isBn ? 'সিস্টেম ক্যাশ ও স্টেট রিফ্রেশ' : 'Sync State & Cache'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          14. TAB: AUDIT LOGS
      ======================================================== */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <span>{isBn ? 'সেন্ট্রাল সিস্টেম অডিট ও সিকিউরিটি লগ' : 'Enterprise Audit Logs & Security Trail'}</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase">
                  <th className="py-3 px-4">টাইমস্ট্যাম্প</th>
                  <th className="py-3 px-4">ইউজার</th>
                  <th className="py-3 px-4">অ্যাকশন</th>
                  <th className="py-3 px-4">মডিউল</th>
                  <th className="py-3 px-4">বিস্তারিত</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-500">{log?.timestamp ? new Date(log.timestamp).toLocaleString() : ''}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{log.userName || log.userId}</td>
                    <td className="py-3 px-4 text-emerald-700 font-bold">{log.action}</td>
                    <td className="py-3 px-4 uppercase">{log.module}</td>
                    <td className="py-3 px-4 text-slate-600 font-sans">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          GENERIC EDIT / CREATE MODAL
      ======================================================== */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {editModal.isNew
                    ? (isBn ? 'নতুন এন্ট্রি তৈরি' : 'Add New Entry')
                    : (isBn ? 'তথ্য এডিট ও হালনাগাদ' : 'Edit Information')}
                </h3>
                <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">
                  মডিউল: {editModal.type}
                </span>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              {/* SLIDE FORM */}
              {editModal.type === 'slide' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">স্লাইড শিরোনাম (English)</label>
                      <input
                        required
                        value={editModal.data.title || ''}
                        onChange={e => handleModalFieldChange('title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">স্লাইড শিরোনাম (বাংলা)</label>
                      <input
                        required
                        value={editModal.data.titleBn || ''}
                        onChange={e => handleModalFieldChange('titleBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">ব্যাজ টেক্সট (English)</label>
                      <input
                        value={editModal.data.badge || ''}
                        onChange={e => handleModalFieldChange('badge', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">ব্যাজ টেক্সট (বাংলা)</label>
                      <input
                        value={editModal.data.badgeBn || ''}
                        onChange={e => handleModalFieldChange('badgeBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">সাবটাইটেল / বিবরণ (English)</label>
                    <textarea
                      rows={2}
                      value={editModal.data.subtitle || ''}
                      onChange={e => handleModalFieldChange('subtitle', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">সাবটাইটেল / বিবরণ (বাংলা)</label>
                    <textarea
                      rows={2}
                      value={editModal.data.subtitleBn || ''}
                      onChange={e => handleModalFieldChange('subtitleBn', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">ছবি URL (HD Image Link)</label>
                    <input
                      required
                      value={editModal.data.imageUrl || ''}
                      onChange={e => handleModalFieldChange('imageUrl', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">বাটন ১ টেক্সট (বাংলা)</label>
                      <input
                        value={editModal.data.buttonTextBn || ''}
                        onChange={e => handleModalFieldChange('buttonTextBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">বাটন ১ অ্যাকশন</label>
                      <select
                        value={editModal.data.buttonAction || 'donation'}
                        onChange={e => handleModalFieldChange('buttonAction', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
                      >
                        <option value="donation">অনলাইন ডোনেশন (donation)</option>
                        <option value="blood-bank">ব্লাড ব্যাংক (blood-bank)</option>
                        <option value="blood_sos">জরুরি রক্ত SOS (blood_sos)</option>
                        <option value="training">কারিগরি প্রশিক্ষণ (training)</option>
                        <option value="school">স্কুল পোর্টাল (school)</option>
                        <option value="somiti">ক্ষুদ্রঋণ সমিতি (somiti)</option>
                        <option value="marketplace">মার্কেটপ্লেস (marketplace)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">বাটন ২ টেক্সট (বাংলা)</label>
                      <input
                        value={editModal.data.secondaryButtonTextBn || ''}
                        onChange={e => handleModalFieldChange('secondaryButtonTextBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">বাটন ২ অ্যাকশন</label>
                      <select
                        value={editModal.data.secondaryButtonAction || 'blood-bank'}
                        onChange={e => handleModalFieldChange('secondaryButtonAction', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-semibold"
                      >
                        <option value="donation">অনলাইন ডোনেশন (donation)</option>
                        <option value="blood-bank">ব্লাড ব্যাংক (blood-bank)</option>
                        <option value="blood_sos">জরুরি রক্ত SOS (blood_sos)</option>
                        <option value="training">কারিগরি প্রশিক্ষণ (training)</option>
                        <option value="school">স্কুল পোর্টাল (school)</option>
                        <option value="somiti">ক্ষুদ্রঋণ সমিতি (somiti)</option>
                        <option value="marketplace">মার্কেটপ্লেস (marketplace)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="slide-active"
                      checked={editModal.data.active !== false}
                      onChange={e => handleModalFieldChange('active', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <label htmlFor="slide-active" className="font-bold text-slate-800">
                      স্লাইডার হোমপেজে সক্রিয় রাখুন (Active)
                    </label>
                  </div>
                </div>
              )}

              {/* USER FORM */}
              {editModal.type === 'user' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">ইউজারনেম</label>
                      <input
                        required
                        value={editModal.data.username || ''}
                        onChange={e => handleModalFieldChange('username', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">পূর্ণ নাম</label>
                      <input
                        required
                        value={editModal.data.fullName || ''}
                        onChange={e => handleModalFieldChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">রোল (RBAC)</label>
                      <select
                        value={editModal.data.role || 'user'}
                        onChange={e => handleModalFieldChange('role', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-bold"
                      >
                        <option value="super_admin">Super Admin (সর্বোচ্চ ক্ষমতা)</option>
                        <option value="org_admin">NGO Organization Admin</option>
                        <option value="branch_manager">Branch Manager (শাখা পরিচালক)</option>
                        <option value="somiti_officer">Somiti Field Officer</option>
                        <option value="teacher">Academy Instructor / Teacher</option>
                        <option value="doctor">Medical Volunteer / Doctor</option>
                        <option value="user">General Member / User</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">মোবাইল নম্বর</label>
                      <input
                        value={editModal.data.phone || ''}
                        onChange={e => handleModalFieldChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">জেলা</label>
                      <select
                        value={editModal.data.district || 'Dhaka'}
                        onChange={e => handleModalFieldChange('district', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white"
                      >
                        {Object.values(BANGLADESH_DISTRICTS).map(d => (
                          <option key={d.name} value={d.name}>{isBn ? d.nameBn : d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">উপজেলা / থানা</label>
                      <input
                        value={editModal.data.upazila || ''}
                        onChange={e => handleModalFieldChange('upazila', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NGO FORM */}
              {editModal.type === 'ngo' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">এনজিওর নাম (English)</label>
                      <input
                        required
                        value={editModal.data.name || ''}
                        onChange={e => handleModalFieldChange('name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">এনজিওর নাম (বাংলা)</label>
                      <input
                        required
                        value={editModal.data.nameBn || ''}
                        onChange={e => handleModalFieldChange('nameBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">রেজিস্ট্রেশন নম্বর</label>
                      <input
                        required
                        value={editModal.data.registrationNumber || ''}
                        onChange={e => handleModalFieldChange('registrationNumber', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">হেডকোয়ার্টার জেলা</label>
                      <input
                        value={editModal.data.district || ''}
                        onChange={e => handleModalFieldChange('district', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BRANCH FORM */}
              {editModal.type === 'branch' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">শাখার নাম (English)</label>
                      <input
                        required
                        value={editModal.data.name || ''}
                        onChange={e => handleModalFieldChange('name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">শাখার নাম (বাংলা)</label>
                      <input
                        required
                        value={editModal.data.nameBn || ''}
                        onChange={e => handleModalFieldChange('nameBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold mb-1">শাখা কোড</label>
                      <input
                        required
                        value={editModal.data.branchCode || ''}
                        onChange={e => handleModalFieldChange('branchCode', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">জেলা</label>
                      <select
                        value={editModal.data.district || 'Dhaka'}
                        onChange={e => handleModalFieldChange('district', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white"
                      >
                        {Object.values(BANGLADESH_DISTRICTS).map(d => (
                          <option key={d.name} value={d.name}>{isBn ? d.nameBn : d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">উপজেলা / থানা</label>
                      <input
                        value={editModal.data.upazila || ''}
                        onChange={e => handleModalFieldChange('upazila', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">ব্যবস্থাপক / পরিচালক (English)</label>
                      <input
                        value={editModal.data.managerName || ''}
                        onChange={e => handleModalFieldChange('managerName', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">ব্যবস্থাপক / পরিচালক (বাংলা)</label>
                      <input
                        value={editModal.data.managerNameBn || ''}
                        onChange={e => handleModalFieldChange('managerNameBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">মোবাইল ফোন</label>
                      <input
                        value={editModal.data.phone || ''}
                        onChange={e => handleModalFieldChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">ইমেইল</label>
                      <input
                        value={editModal.data.email || ''}
                        onChange={e => handleModalFieldChange('email', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">কমিটির মেয়াদকাল</label>
                      <input
                        value={editModal.data.committeeTerm || '2025-2027'}
                        onChange={e => handleModalFieldChange('committeeTerm', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-bold"
                        placeholder="2025-2027"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">কমিটির শিরোনাম (বাংলা)</label>
                      <input
                        value={editModal.data.committeeTitleBn || 'দ্বি-বার্ষিক কার্যনির্বাহী পরিষদ'}
                        onChange={e => handleModalFieldChange('committeeTitleBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">শাখা কার্যালয়ের পূর্ণ ঠিকানা (বাংলা)</label>
                    <input
                      value={editModal.data.addressBn || editModal.data.address || ''}
                      onChange={e => handleModalFieldChange('addressBn', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="branch-approved"
                        checked={editModal.data.status === 'active' || editModal.data.status === 'approved'}
                        onChange={e => handleModalFieldChange('status', e.target.checked ? 'active' : 'pending')}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <label htmlFor="branch-approved" className="font-bold text-slate-800">
                        শাখা অনুমোদন সম্পন্ন (Approved)
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="branch-published"
                        checked={!!editModal.data.committeePublished}
                        onChange={e => handleModalFieldChange('committeePublished', e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <label htmlFor="branch-published" className="font-bold text-emerald-800">
                        কমিটি পাবলিক ওয়েবসাইটে প্রকাশ করুন (Publish Committee)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* CAMPAIGN FORM */}
              {editModal.type === 'campaign' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">ক্যাম্পেইন শিরোনাম (English)</label>
                      <input
                        required
                        value={editModal.data.title || ''}
                        onChange={e => handleModalFieldChange('title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">ক্যাম্পেইন শিরোনাম (বাংলা)</label>
                      <input
                        required
                        value={editModal.data.titleBn || ''}
                        onChange={e => handleModalFieldChange('titleBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">লক্ষ্যমাত্রা (BDT)</label>
                      <input
                        type="number"
                        required
                        value={editModal.data.targetAmount || 100000}
                        onChange={e => handleModalFieldChange('targetAmount', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl font-black"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">সংগৃহীত পরিমাণ (BDT)</label>
                      <input
                        type="number"
                        value={editModal.data.raisedAmount || 0}
                        onChange={e => handleModalFieldChange('raisedAmount', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl font-black"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">ক্যাটাগরি</label>
                      <input
                        value={editModal.data.category || 'Disaster Relief'}
                        onChange={e => handleModalFieldChange('category', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">স্ট্যাটাস</label>
                      <select
                        value={editModal.data.status || 'active'}
                        onChange={e => handleModalFieldChange('status', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white"
                      >
                        <option value="active">Active (সক্রিয়)</option>
                        <option value="completed">Completed (সম্পন্ন)</option>
                        <option value="paused">Paused (সাময়িক স্থগিত)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">ব্যানার ইমেজ লিংক (URL)</label>
                    <input
                      value={editModal.data.imageUrl || ''}
                      onChange={e => handleModalFieldChange('imageUrl', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl font-mono"
                    />
                  </div>
                </div>
              )}

              {/* DONOR FORM */}
              {editModal.type === 'donor' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">রক্তদাতার পূর্ণ নাম</label>
                      <input
                        required
                        value={editModal.data.fullName || ''}
                        onChange={e => handleModalFieldChange('fullName', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">রক্তের গ্রুপ</label>
                      <select
                        value={editModal.data.bloodGroup || 'A+'}
                        onChange={e => handleModalFieldChange('bloodGroup', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-bold text-rose-600"
                      >
                        {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">মোবাইল নম্বর</label>
                      <input
                        required
                        value={editModal.data.phone || ''}
                        onChange={e => handleModalFieldChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">সর্বশেষ রক্তদান তারিখ</label>
                      <input
                        type="date"
                        value={editModal.data.lastDonationDate || ''}
                        onChange={e => handleModalFieldChange('lastDonationDate', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">জেলা</label>
                      <select
                        value={editModal.data.district || 'Dhaka'}
                        onChange={e => handleModalFieldChange('district', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white"
                      >
                        {Object.values(BANGLADESH_DISTRICTS).map(d => (
                          <option key={d.name} value={d.name}>{isBn ? d.nameBn : d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">উপজেলা / থানা</label>
                      <input
                        value={editModal.data.upazila || ''}
                        onChange={e => handleModalFieldChange('upazila', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BLOOD COMMITTEE & COORDINATOR FORM */}
              {editModal.type === 'bloodCommittee' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">সমন্বয়কের নাম (English)</label>
                      <input
                        required
                        value={editModal.data.name || ''}
                        onChange={e => handleModalFieldChange('name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-medium"
                        placeholder="e.g. Dr. Mahmudul Hasan"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">সমন্বয়কের নাম (বাংলা)</label>
                      <input
                        required
                        value={editModal.data.nameBn || ''}
                        onChange={e => handleModalFieldChange('nameBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-medium"
                        placeholder="যেমন: ডা. মাহমুদুল হাসান"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">পদবি / দায়িত্ব (English)</label>
                      <input
                        required
                        value={editModal.data.designation || ''}
                        onChange={e => handleModalFieldChange('designation', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-medium"
                        placeholder="e.g. District Blood Coordinator"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">পদবি / দায়িত্ব (বাংলা)</label>
                      <input
                        required
                        value={editModal.data.designationBn || ''}
                        onChange={e => handleModalFieldChange('designationBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-medium"
                        placeholder="যেমন: জেলা ব্লাড ব্যাংক ইনচার্জ"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold mb-1">রক্তের গ্রুপ</label>
                      <select
                        value={editModal.data.bloodGroup || 'O+'}
                        onChange={e => handleModalFieldChange('bloodGroup', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white font-bold text-rose-600"
                      >
                        {['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">মোবাইল নম্বর</label>
                      <input
                        required
                        value={editModal.data.phone || ''}
                        onChange={e => handleModalFieldChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                        placeholder="01973817167"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">ইমেইল</label>
                      <input
                        type="email"
                        value={editModal.data.email || ''}
                        onChange={e => handleModalFieldChange('email', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                        placeholder="blood@ascado.org"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold mb-1">জেলা</label>
                      <select
                        value={editModal.data.district || 'Dhaka'}
                        onChange={e => handleModalFieldChange('district', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white"
                      >
                        {Object.values(BANGLADESH_DISTRICTS).map(d => (
                          <option key={d.name} value={d.name}>{isBn ? d.nameBn : d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold mb-1">উপজেলা / থানা</label>
                      <input
                        value={editModal.data.upazila || ''}
                        onChange={e => handleModalFieldChange('upazila', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                        placeholder="যেমন: ধানমন্ডি"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">শাখার নাম</label>
                      <input
                        value={editModal.data.branchName || ''}
                        onChange={e => handleModalFieldChange('branchName', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                        placeholder="যেমন: ঢাকা কেন্দ্রীয় শাখা"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">ছবির URL (Photo Link)</label>
                      <input
                        value={editModal.data.photoUrl || ''}
                        onChange={e => handleModalFieldChange('photoUrl', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-mono"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">দায়িত্বের ধরন (Role Category)</label>
                      <select
                        value={editModal.data.roleType || 'branch'}
                        onChange={e => handleModalFieldChange('roleType', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-white"
                      >
                        <option value="central">কেন্দ্রীয় ব্লাড উইং (Central Wing)</option>
                        <option value="division">বিভাগীয় সমন্বয়ক (Divisional Lead)</option>
                        <option value="branch">শাখা ও উপজেলা ইনচার্জ (Branch In-Charge)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={editModal.data.status === 'active' || editModal.data.status === undefined}
                        onChange={e => handleModalFieldChange('status', e.target.checked ? 'active' : 'inactive')}
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <span>সক্রিয় সমন্বয়ক (Active Coordinator)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-rose-700">
                      <input
                        type="checkbox"
                        checked={!!editModal.data.isEmergencyLead}
                        onChange={e => handleModalFieldChange('isEmergencyLead', e.target.checked)}
                        className="w-4 h-4 text-rose-600 rounded"
                      />
                      <span>জরুরি রেসপন্স লিডার (Emergency SOS Lead)</span>
                    </label>
                  </div>
                </div>
              )}

              {/* COURSE FORM */}
              {editModal.type === 'course' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">কোর্স নাম (English)</label>
                      <input
                        required
                        value={editModal.data.title || ''}
                        onChange={e => handleModalFieldChange('title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">কোর্স নাম (বাংলা)</label>
                      <input
                        required
                        value={editModal.data.titleBn || ''}
                        onChange={e => handleModalFieldChange('titleBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">প্রশিক্ষক</label>
                      <input
                        value={editModal.data.instructor || ''}
                        onChange={e => handleModalFieldChange('instructor', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">কোর্স ফি (BDT)</label>
                      <input
                        type="number"
                        value={editModal.data.fee || 0}
                        onChange={e => handleModalFieldChange('fee', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl font-bold text-emerald-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PRODUCT FORM */}
              {editModal.type === 'product' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">পণ্যের নাম (English)</label>
                      <input
                        required
                        value={editModal.data.name || ''}
                        onChange={e => handleModalFieldChange('name', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">পণ্যের নাম (বাংলা)</label>
                      <input
                        required
                        value={editModal.data.nameBn || ''}
                        onChange={e => handleModalFieldChange('nameBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold mb-1">মূল্য (BDT)</label>
                      <input
                        type="number"
                        required
                        value={editModal.data.price || 0}
                        onChange={e => handleModalFieldChange('price', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl font-black"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">মজুদ (Stock)</label>
                      <input
                        type="number"
                        value={editModal.data.stock || 10}
                        onChange={e => handleModalFieldChange('stock', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">কমিশন রেট (যেমন 0.10)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editModal.data.platformCommissionRate || 0.10}
                        onChange={e => handleModalFieldChange('platformCommissionRate', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">বিক্রেতা / সেলার নাম</label>
                    <input
                      value={editModal.data.sellerName || ''}
                      onChange={e => handleModalFieldChange('sellerName', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* PROPERTY FORM */}
              {editModal.type === 'property' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">প্রপার্টি শিরোনাম (English)</label>
                      <input
                        required
                        value={editModal.data.title || ''}
                        onChange={e => handleModalFieldChange('title', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">প্রপার্টি শিরোনাম (বাংলা)</label>
                      <input
                        required
                        value={editModal.data.titleBn || ''}
                        onChange={e => handleModalFieldChange('titleBn', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">মূল্য / ভাড়া (BDT)</label>
                      <input
                        type="number"
                        value={editModal.data.price || 0}
                        onChange={e => handleModalFieldChange('price', Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">লোকেশন</label>
                      <input
                        value={editModal.data.location || ''}
                        onChange={e => handleModalFieldChange('location', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="prop-verified"
                      checked={!!editModal.data.isLegallyVerified}
                      onChange={e => handleModalFieldChange('isLegallyVerified', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <label htmlFor="prop-verified" className="font-bold text-slate-800">
                      লিগ্যাল ভেরিফাইড সিল প্রদান করুন (Verified Property Badge)
                    </label>
                  </div>
                </div>
              )}

              {/* NOTICE FORM */}
              {editModal.type === 'notice' && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold mb-1">বিজ্ঞপ্তি শিরোনাম (English)</label>
                    <input
                      required
                      value={editModal.data.title || ''}
                      onChange={e => handleModalFieldChange('title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">বিজ্ঞপ্তি শিরোনাম (বাংলা)</label>
                    <input
                      required
                      value={editModal.data.titleBn || ''}
                      onChange={e => handleModalFieldChange('titleBn', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold mb-1">ক্যাটাগরি</label>
                      <input
                        value={editModal.data.category || 'General'}
                        onChange={e => handleModalFieldChange('category', e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="notice-urgent"
                        checked={!!editModal.data.isUrgent}
                        onChange={e => handleModalFieldChange('isUrgent', e.target.checked)}
                        className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                      />
                      <label htmlFor="notice-urgent" className="font-bold text-rose-700">
                        জরুরি বিজ্ঞপ্তি (Urgent Notice)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition"
                >
                  <Save className="w-4 h-4" />
                  <span>{isBn ? 'সংরক্ষণ করুন' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          15. DEDICATED BRANCH COMMITTEE MANAGEMENT MODAL
      ======================================================== */}
      {committeeModal.isOpen && committeeModal.branch && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded">
                    {committeeModal.branch.branchCode}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      committeeModal.branch.status === 'active' || committeeModal.branch.status === 'approved'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-slate-900 font-extrabold'
                    }`}
                  >
                    {committeeModal.branch.status === 'active' || committeeModal.branch.status === 'approved'
                      ? (isBn ? '✓ অনুমোদিত শাখা' : 'Approved Branch')
                      : (isBn ? '⏳ আবেদন প্রক্রিয়াধীন' : 'Pending Approval')}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      committeeModal.branch.committeePublished
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {committeeModal.branch.committeePublished
                      ? (isBn ? 'ওয়েবসাইটে প্রকাশিত' : 'Published on Web')
                      : (isBn ? 'অপ্রকাশিত খসড়া' : 'Draft / Hidden')}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold mt-1.5 text-white">
                  {isBn ? committeeModal.branch.nameBn : committeeModal.branch.name} — {isBn ? 'কার্যনির্বাহী পরিচালনা পরিষদ' : 'Executive Committee'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {committeeModal.branch.district} | {committeeModal.branch.upazila || (isBn ? 'সদর' : 'Sadar')} • {isBn ? 'মেয়াদ:' : 'Term:'} <strong className="text-emerald-400">{committeeModal.branch.committeeTerm || '2025-2027'}</strong>
                </p>
              </div>

              <button
                onClick={() => setCommitteeModal(prev => ({ ...prev, isOpen: false }))}
                className="p-2 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Actions & Stats Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{isBn ? 'মোট কর্মকর্তা সদস্য:' : 'Total Members:'}</span>
                  <span className="text-emerald-700 font-extrabold">{committeeModal.branch.committeeMembers?.length || 0} জন</span>
                </div>

                <button
                  onClick={() => handleTogglePublishCommittee(committeeModal.branch)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                    committeeModal.branch.committeePublished
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {committeeModal.branch.committeePublished
                      ? (isBn ? 'পাবলিক পেজ থেকে হাইড করুন' : 'Hide from Public')
                      : (isBn ? 'ওয়েবসাইটে পাবলিশ করুন' : 'Publish to Public Page')}
                  </span>
                </button>

                {!(committeeModal.branch.status === 'active' || committeeModal.branch.status === 'approved') && (
                  <button
                    onClick={() => handleApproveBranch(committeeModal.branch)}
                    className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{isBn ? 'শাখা আবেদন অনুমোদন করুন' : 'Approve Application'}</span>
                  </button>
                )}
              </div>

              <button
                onClick={openAddMemberForm}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isBn ? 'নতুন কমিটি সদস্য যুক্ত করুন' : 'Add Committee Member'}</span>
              </button>
            </div>

            {/* Committee Members Table */}
            <div className="flex-1 overflow-y-auto p-6">
              {(!committeeModal.branch.committeeMembers || committeeModal.branch.committeeMembers.length === 0) ? (
                <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-slate-800">
                    {isBn ? 'এই শাখায় এখনও কোনো কমিটি সদস্য যুক্ত করা হয়নি' : 'No committee members added yet'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    {isBn
                      ? 'অনুমোদনের পর কমিটির সকল কর্মকর্তার ছবি, নাম, পিতার নাম, পদবি ও ঠিকানা এখানে যোগ করুন।'
                      : 'Add officer photos, names, father names, designations, and addresses.'}
                  </p>
                  <button
                    onClick={openAddMemberForm}
                    className="mt-4 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>{isBn ? 'প্রথম সদস্য যোগ করুন' : 'Add First Member'}</span>
                  </button>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                        <th className="py-3.5 px-3 text-center w-14">{isBn ? 'ছবি' : 'Photo'}</th>
                        <th className="py-3.5 px-4">{isBn ? 'সদস্যের নাম' : 'Member Name'}</th>
                        <th className="py-3.5 px-4">{isBn ? 'পিতার নাম' : 'Father\'s Name'}</th>
                        <th className="py-3.5 px-4">{isBn ? 'কমিটি পদবি' : 'Designation'}</th>
                        <th className="py-3.5 px-4">{isBn ? 'পূর্ণ ঠিকানা' : 'Address'}</th>
                        <th className="py-3.5 px-4">{isBn ? 'যোগাযোগ' : 'Contact'}</th>
                        <th className="py-3.5 px-3 text-center">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                        <th className="py-3.5 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(committeeModal.branch?.committeeMembers || []).map((member: any, index: number) => (
                        <tr key={member.id || index} className="hover:bg-slate-50 transition">
                          {/* 1. Photo */}
                          <td className="py-3 px-3 text-center">
                            <img
                              src={member.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/30 mx-auto shadow-2xs"
                            />
                          </td>

                          {/* 2. Member Name */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 text-sm">{isBn ? (member.nameBn || member.name) : member.name}</div>
                            {member.nameBn && member.name && member.nameBn !== member.name && (
                              <div className="text-[11px] text-slate-400 font-normal">{member.name}</div>
                            )}
                            {member.nid && (
                              <span className="inline-block text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">
                                NID: {member.nid}
                              </span>
                            )}
                          </td>

                          {/* 3. Father's Name */}
                          <td className="py-3 px-4">
                            <div className="text-slate-800 font-medium">{isBn ? (member.fatherNameBn || member.fatherName || '—') : (member.fatherName || '—')}</div>
                            {member.fatherNameBn && member.fatherName && member.fatherNameBn !== member.fatherName && (
                              <div className="text-[10px] text-slate-400">{member.fatherName}</div>
                            )}
                          </td>

                          {/* 4. Designation */}
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>{isBn ? (member.designationBn || member.designation) : member.designation}</span>
                            </span>
                          </td>

                          {/* 5. Address */}
                          <td className="py-3 px-4 max-w-xs">
                            <p className="text-slate-700 text-xs leading-snug">{isBn ? (member.addressBn || member.address || '—') : (member.address || '—')}</p>
                          </td>

                          {/* 6. Contact */}
                          <td className="py-3 px-4">
                            <div className="font-mono text-slate-800 text-xs font-semibold">{member.phone || '—'}</div>
                            {member.email && (
                              <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{member.email}</div>
                            )}
                          </td>

                          {/* 7. Status */}
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                member.status === 'inactive'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {member.status === 'inactive' ? (isBn ? 'নিষ্ক্রিয়' : 'Inactive') : (isBn ? 'সক্রিয়' : 'Active')}
                            </span>
                          </td>

                          {/* 8. Actions */}
                          <td className="py-3 px-4 text-right space-x-1.5">
                            <button
                              onClick={() => openEditMemberForm(member)}
                              className="text-emerald-700 hover:text-emerald-800 p-1.5 rounded-lg hover:bg-emerald-50 font-bold inline-flex items-center gap-1 transition"
                              title="Edit Member"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{isBn ? 'এডিট' : 'Edit'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member.id, member.nameBn || member.name)}
                              className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 font-bold inline-flex items-center gap-1 transition"
                              title="Remove Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{isBn ? 'মুছুন' : 'Delete'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs text-slate-500">
                {isBn ? 'ওয়েবসাইটে এই শাখার জন্য কমিটি প্রকাশের নিয়ম ও শর্তাবলী সক্রিয় রয়েছে।' : 'Committee roster will be synchronized with the public branches page.'}
              </span>
              <button
                onClick={() => setCommitteeModal(prev => ({ ...prev, isOpen: false }))}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow transition"
              >
                {isBn ? 'বন্ধ করুন' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          16. COMMITTEE MEMBER ADD / EDIT SUB-MODAL
      ======================================================== */}
      {committeeModal.isMemberFormOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-base">
                  {committeeModal.isNewMember ? (isBn ? 'নতুন কার্যনির্বাহী পরিষদ সদস্য যোগ করুন' : 'Add Committee Member') : (isBn ? 'কমিটি সদস্য তথ্য এডিট করুন' : 'Edit Committee Member')}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {committeeModal.branch?.nameBn || committeeModal.branch?.name}
                </p>
              </div>
              <button
                onClick={() => setCommitteeModal(prev => ({ ...prev, isMemberFormOpen: false }))}
                className="p-1.5 hover:bg-white/10 rounded-full text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {/* Member Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'সদস্যের নাম (বাংলা)' : 'Member Name (Bengali)'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={committeeModal.memberData.nameBn || ''}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, nameBn: e.target.value } }))}
                    placeholder="যেমন: আলহাজ্ব মো. রফিকুল ইসলাম"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'সদস্যের নাম (English)' : 'Member Name (English)'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={committeeModal.memberData.name || ''}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, name: e.target.value } }))}
                    placeholder="e.g. Al-Haj Md. Rafiqul Islam"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Father's Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'পিতার নাম (বাংলা)' : 'Father\'s Name (Bengali)'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={committeeModal.memberData.fatherNameBn || ''}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, fatherNameBn: e.target.value } }))}
                    placeholder="যেমন: মরহুম আব্দুল করিম"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'পিতার নাম (English)' : 'Father\'s Name (English)'}
                  </label>
                  <input
                    value={committeeModal.memberData.fatherName || ''}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, fatherName: e.target.value } }))}
                    placeholder="e.g. Late Abdul Karim"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Designation Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'পদবি (বাংলায়)' : 'Designation (Bengali)'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={committeeModal.memberData.designationBn || ''}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, designationBn: e.target.value } }))}
                    placeholder="যেমন: সভাপতি / সাধারণ সম্পাদক / কোষাধ্যক্ষ"
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['সভাপতি', 'সহ-সভাপতি', 'সাধারণ সম্পাদক', 'যুগ্ম-সাধারণ সম্পাদক', 'কোষাধ্যক্ষ', 'সাংগঠনিক সম্পাদক', 'দপ্তর সম্পাদক', 'প্রচার সম্পাদক', 'কার্যনির্বাহী সদস্য'].map(desig => (
                      <button
                        type="button"
                        key={desig}
                        onClick={() => {
                          const enMap: Record<string, string> = {
                            'সভাপতি': 'President',
                            'সহ-সভাপতি': 'Vice President',
                            'সাধারণ সম্পাদক': 'General Secretary',
                            'যুগ্ম-সাধারণ সম্পাদক': 'Joint Secretary',
                            'কোষাধ্যক্ষ': 'Treasurer',
                            'সাংগঠনিক সম্পাদক': 'Organizing Secretary',
                            'দপ্তর সম্পাদক': 'Office Secretary',
                            'প্রচার সম্পাদক': 'Publicity Secretary',
                            'কার্যনির্বাহী সদস্য': 'Executive Member'
                          };
                          setCommitteeModal(prev => ({
                            ...prev,
                            memberData: {
                              ...prev.memberData,
                              designationBn: desig,
                              designation: enMap[desig] || desig
                            }
                          }));
                        }}
                        className="text-[10px] bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 px-2 py-0.5 rounded transition"
                      >
                        {desig}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'পদবি (English)' : 'Designation (English)'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={committeeModal.memberData.designation || ''}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, designation: e.target.value } }))}
                    placeholder="e.g. President / General Secretary"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'পূর্ণ ঠিকানা (বাংলা)' : 'Full Address (Bengali)'} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={committeeModal.memberData.addressBn || ''}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, addressBn: e.target.value } }))}
                    placeholder="গ্রাম, ডাকঘর, উপজেলা, জেলা"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'পূর্ণ ঠিকানা (English)' : 'Full Address (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={committeeModal.memberData.address || ''}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, address: e.target.value } }))}
                    placeholder="Village, PO, Upazila, District"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Contact & NID */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'মোবাইল নম্বর' : 'Phone Number'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={committeeModal.memberData.phone || ''}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, phone: e.target.value } }))}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={committeeModal.memberData.email || ''}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, email: e.target.value } }))}
                    placeholder="name@domain.com"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'এনআইডি / জন্মনিবন্ধন' : 'NID / Reg No'}
                  </label>
                  <input
                    value={committeeModal.memberData.nid || ''}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, nid: e.target.value } }))}
                    placeholder="জাতীয় পরিচয়পত্র নম্বর"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              {/* Photo & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'সদস্যের ছবি (Photo URL)' : 'Photo URL'}
                  </label>
                  <input
                    value={committeeModal.memberData.photoUrl || ''}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, photoUrl: e.target.value } }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'ক্রমিক নম্বর (Order)' : 'Display Order'}
                  </label>
                  <input
                    type="number"
                    value={committeeModal.memberData.order || 1}
                    onChange={e => setCommitteeModal(prev => ({ ...prev, memberData: { ...prev.memberData, order: parseInt(e.target.value) || 1 } }))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCommitteeModal(prev => ({ ...prev, isMemberFormOpen: false }))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl shadow transition"
                >
                  <Save className="w-4 h-4" />
                  <span>{isBn ? 'সদস্য সংরক্ষণ করুন' : 'Save Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          NAVIGATION MENU EDIT / CREATE MODAL
      ======================================================== */}
      {menuModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>{menuModal.isNew ? (isBn ? 'নতুন নেভিগেশন মেনু তৈরি' : 'Create Navigation Menu Item') : (isBn ? 'নেভিগেশন মেনু এডিট' : 'Edit Navigation Menu Item')}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn ? 'ওয়েবসাইটের হেডার, প্রোগ্রাম বা অর্থনৈতিক মেনু কনফিগার করুন।' : 'Configure menu name, target tab, category, and display order.'}
                </p>
              </div>
              <button
                onClick={() => setMenuModal(prev => ({ ...prev, isOpen: false }))}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'মেনুর নাম (বাংলায়)' : 'Menu Label (Bengali)'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={menuModal.data.nameBn || ''}
                    onChange={e => setMenuModal(prev => ({ ...prev, data: { ...prev.data, nameBn: e.target.value } }))}
                    placeholder="যেমন: অনুদান তহবিল"
                    className="w-full px-3 py-2 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'মেনুর নাম (English)' : 'Menu Label (English)'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={menuModal.data.name || ''}
                    onChange={e => setMenuModal(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                    placeholder="e.g. Donations"
                    className="w-full px-3 py-2 border rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'টার্গেট পেইজ / ট্যাব আইডি' : 'Target Tab / Path'} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={menuModal.data.tab || ''}
                    onChange={e => setMenuModal(prev => ({ ...prev, data: { ...prev.data, tab: e.target.value } }))}
                    className="w-full px-3 py-2 border rounded-xl bg-white font-medium"
                  >
                    <option value="home">হোম (home)</option>
                    <option value="about">আমাদের সম্পর্কে (about)</option>
                    <option value="committee">কমিটি ও নেতৃবৃন্দ (committee)</option>
                    <option value="branches">শাখা নেটওয়ার্ক (branches)</option>
                    <option value="ngos">স্বীকৃত এনজিও (ngos)</option>
                    <option value="donations">দান ও যাকাত (donations)</option>
                    <option value="blood">ব্লাড ব্যাংক (blood)</option>
                    <option value="school">ডিজিটাল একাডেমি (school)</option>
                    <option value="somiti">সমিতি ও ক্ষুদ্রঋণ (somiti)</option>
                    <option value="marketplace">হালাল মার্কেট (marketplace)</option>
                    <option value="realestate">রিয়েল এস্টেট (realestate)</option>
                    <option value="marriage">ম্যারেজ মিডিয়া (marriage)</option>
                    <option value="notices">নোটিশ বোর্ড (notices)</option>
                    <option value="contact">যোগাযোগ (contact)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'মেনু বিভাগ (Category)' : 'Category / Section'}
                  </label>
                  <select
                    value={menuModal.data.category || 'header'}
                    onChange={e => setMenuModal(prev => ({ ...prev, data: { ...prev.data, category: e.target.value as any } }))}
                    className="w-full px-3 py-2 border rounded-xl bg-white font-medium"
                  >
                    <option value="header">{isBn ? 'মূল হেডার মেনু (Header Menu)' : 'Header Top Menu'}</option>
                    <option value="programs">{isBn ? 'কর্মসূচি ড্রপডাউন (Programs Menu)' : 'Programs Submenu'}</option>
                    <option value="economic">{isBn ? 'অর্থনৈতিক ড্রপডাউন (Economic Menu)' : 'Economic Submenu'}</option>
                    <option value="footer">{isBn ? 'ফুটার মেনু (Footer Menu)' : 'Footer Menu'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'আইকন নির্বাচন (Icon Name)' : 'Icon Identifier'}
                  </label>
                  <select
                    value={menuModal.data.icon || 'Sparkles'}
                    onChange={e => setMenuModal(prev => ({ ...prev, data: { ...prev.data, icon: e.target.value } }))}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Home">Home (হোম)</option>
                    <option value="Users">Users (ইউজার/কমিটি)</option>
                    <option value="Building2">Building2 (শাখা/এনজিও)</option>
                    <option value="Heart">Heart (দান/যাকাত)</option>
                    <option value="HeartPulse">HeartPulse (ব্লাড ব্যাংক)</option>
                    <option value="GraduationCap">GraduationCap (একাডেমি)</option>
                    <option value="Landmark">Landmark (সমিতি/ঋণ)</option>
                    <option value="ShoppingBag">ShoppingBag (মার্কেটপ্লেস)</option>
                    <option value="Compass">Compass (রিয়েল এস্টেট)</option>
                    <option value="Bell">Bell (নোটিশ)</option>
                    <option value="Phone">Phone (যোগাযোগ)</option>
                    <option value="ShieldCheck">ShieldCheck (নিরাপত্তা)</option>
                    <option value="Sparkles">Sparkles (বিশেষ সেবা)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'ক্রমিক নম্বর (Display Order)' : 'Order'}
                  </label>
                  <input
                    type="number"
                    value={menuModal.data.order || 0}
                    onChange={e => setMenuModal(prev => ({ ...prev, data: { ...prev.data, order: parseInt(e.target.value) || 0 } }))}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'হাইলাইট ব্যাজ (যদি থাকে)' : 'Badge Label'}
                  </label>
                  <input
                    value={menuModal.data.badge || ''}
                    onChange={e => setMenuModal(prev => ({ ...prev, data: { ...prev.data, badge: e.target.value } }))}
                    placeholder="e.g. HOT, NEW, 24/7"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="menu-active"
                    checked={menuModal.data.isActive !== false}
                    onChange={e => setMenuModal(prev => ({ ...prev, data: { ...prev.data, isActive: e.target.checked } }))}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <label htmlFor="menu-active" className="font-bold text-slate-800">
                    {isBn ? 'মেনুটি ওয়েবসাইটে দৃশ্যমান রাখুন' : 'Active and visible in navigation'}
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMenuModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-xl shadow transition"
                >
                  <Save className="w-4 h-4" />
                  <span>{isBn ? 'মেনু সংরক্ষণ করুন' : 'Save Menu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          ADVERTISEMENT CREATE / EDIT MODAL
      ======================================================== */}
      {adModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-amber-600" />
                  <span>
                    {adModal.isNew
                      ? (isBn ? 'নতুন বিজ্ঞাপন ও ব্যানার যুক্ত করুন' : 'Create New Advertisement')
                      : (isBn ? 'বিজ্ঞাপন সম্পাদনা' : 'Edit Advertisement')}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn
                    ? 'ছবি ব্যানার, ক্লিক লিংক ও কাঙ্ক্ষিত স্লট নির্বাচন করে বিজ্ঞাপন প্রকাশ করুন।'
                    : 'Configure banner visual, destination click link, and designated placement slot.'}
                </p>
              </div>
              <button
                onClick={() => setAdModal(prev => ({ ...prev, isOpen: false }))}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAd} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'বিজ্ঞাপনের শিরোনাম (বাংলা)' : 'Ad Title (Bengali)'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={adModal.data.titleBn}
                    onChange={e => setAdModal(prev => ({ ...prev, data: { ...prev.data, titleBn: e.target.value } }))}
                    placeholder="যেমন: এসকাডো যুব কম্পিউটার প্রশিক্ষণ মেগা ছাড়"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'শিরোনাম (English)' : 'Ad Title (English)'}
                  </label>
                  <input
                    value={adModal.data.title}
                    onChange={e => setAdModal(prev => ({ ...prev, data: { ...prev.data, title: e.target.value } }))}
                    placeholder="e.g. Mega Discount on IT Vocational Courses"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'বিজ্ঞাপনের ব্যানার ছবির লিংক (Image URL)' : 'Banner Image URL'} <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="url"
                  value={adModal.data.imageUrl}
                  onChange={e => setAdModal(prev => ({ ...prev, data: { ...prev.data, imageUrl: e.target.value } }))}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-amber-500"
                />
                {adModal.data.imageUrl && (
                  <div className="mt-2 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                    <img
                      src={adModal.data.imageUrl}
                      alt="Banner Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'ক্লিক লিংক / টার্গেট URL' : 'Target Click URL'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    required
                    value={adModal.data.targetUrl}
                    onChange={e => setAdModal(prev => ({ ...prev, data: { ...prev.data, targetUrl: e.target.value } }))}
                    placeholder="https://example.com/promo or https://ascahdo.org/training"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'বিজ্ঞাপন প্রদর্শনের স্লট' : 'Placement Slot'} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={adModal.data.position}
                    onChange={e => setAdModal(prev => ({ ...prev, data: { ...prev.data, position: e.target.value as any } }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="top_leaderboard">{isBn ? 'টপ হেডার ব্যানার (Leaderboard)' : 'Top Header Leaderboard (728x90)'}</option>
                    <option value="home_mid_banner">{isBn ? 'হোমপেজ মিড ব্যানার (High Impact)' : 'Home Mid Banner (970x250)'}</option>
                    <option value="sidebar_box">{isBn ? 'সাইডবার বক্স ব্যানার (Medium Rectangle)' : 'Sidebar Box (300x250)'}</option>
                    <option value="content_banner">{isBn ? 'পেইজ ইন-কন্টেন্ট ব্যানার (In-Article)' : 'In-Content Banner (Fluid)'}</option>
                    <option value="footer_banner">{isBn ? 'ফুটার ব্যানার (Pre-Footer)' : 'Pre-Footer Banner'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'স্পনসর / ক্লায়েন্টের নাম' : 'Sponsor / Client Name'}
                  </label>
                  <input
                    value={adModal.data.clientName}
                    onChange={e => setAdModal(prev => ({ ...prev, data: { ...prev.data, clientName: e.target.value } }))}
                    placeholder="যেমন: ড্যাফোডিল সফটওয়্যার পার্ক"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'ডিসপ্লে অগ্রাধিকার ক্রম (Order)' : 'Display Priority Order'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={adModal.data.order}
                    onChange={e => setAdModal(prev => ({ ...prev, data: { ...prev.data, order: Number(e.target.value) } }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={adModal.data.openInNewTab}
                    onChange={e => setAdModal(prev => ({ ...prev, data: { ...prev.data, openInNewTab: e.target.checked } }))}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>{isBn ? 'নতুন ট্যাবে খুলুন (Open in New Tab)' : 'Open target in new tab'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={adModal.data.isActive}
                    onChange={e => setAdModal(prev => ({ ...prev, data: { ...prev.data, isActive: e.target.checked } }))}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{isBn ? 'অবিলম্বে সক্রিয় রাখুন (Active)' : 'Keep Ad Active'}</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-2 rounded-xl shadow transition"
                >
                  <Save className="w-4 h-4" />
                  <span>{isBn ? 'বিজ্ঞাপন সংরক্ষণ ও প্রকাশ' : 'Save & Publish Ad'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
