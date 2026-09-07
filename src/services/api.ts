export const getApiBase = (): string => {
  if (typeof window !== 'undefined') {
    // 1. Custom stored endpoint override
    const custom = localStorage.getItem('ascado_api_base');
    if (custom) return custom.replace(/\/+$/, '');

    // 2. WordPress localized environment (window.ascadoWP)
    const wp = (window as any).ascadoWP;
    if (wp?.apiUrl) return wp.apiUrl.replace(/\/+$/, '');
    if (wp?.cloudUrl) return `${wp.cloudUrl.replace(/\/+$/, '')}/api/v1`;

    // 3. External WordPress host domain fallback to live cloud API
    const origin = window.location.origin;
    if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1') && !origin.includes('run.app')) {
      return 'https://ais-pre-rwxbwksjszfduuryafono5-612448757717.asia-southeast1.run.app/api/v1';
    }
  }
  return '/api/v1';
};

export const API_BASE = getApiBase();

export const getAuthHeader = () => {
  const token = localStorage.getItem('ascado_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  login: async (credentials: any) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  sendOtp: async (phone: string, channel: 'sms' | 'whatsapp' = 'sms') => {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, channel })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send OTP');
    }
    return res.json();
  },

  verifyOtp: async (phone: string, otp: string) => {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'OTP verification failed');
    }
    return res.json();
  },

  register: async (userData: any) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  changePassword: async (passwords: any) => {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(passwords)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Password update failed');
    }
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error('Session expired');
    return res.json();
  },

  // Organizations & NGOs
  getOrganizations: async () => {
    const res = await fetch(`${API_BASE}/organizations`);
    return res.json();
  },

  getNgos: async () => {
    const res = await fetch(`${API_BASE}/organizations`);
    return res.json();
  },

  createNgo: async (data: any) => {
    const res = await fetch(`${API_BASE}/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateOrganization: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/organizations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteOrganization: async (id: string) => {
    const res = await fetch(`${API_BASE}/organizations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Users (Admin)
  getUsers: async () => {
    const res = await fetch(`${API_BASE}/users`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  createUser: async (data: any) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateUser: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteUser: async (id: string) => {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Hero Slides
  getHeroSlides: async () => {
    const res = await fetch(`${API_BASE}/hero-slides`);
    return res.json();
  },

  createHeroSlide: async (data: any) => {
    const res = await fetch(`${API_BASE}/hero-slides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateHeroSlide: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/hero-slides/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteHeroSlide: async (id: string) => {
    const res = await fetch(`${API_BASE}/hero-slides/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Photo Gallery & Media Hub
  getGalleryPhotos: async (category?: string, search?: string) => {
    let url = `${API_BASE}/gallery`;
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search && search.trim() !== '') params.append('search', search);
    if (params.toString()) url += `?${params.toString()}`;
    const res = await fetch(url);
    return res.json();
  },

  createGalleryPhoto: async (data: any) => {
    const res = await fetch(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  uploadGalleryPhoto: async (data: {
    imageBase64: string;
    title?: string;
    titleBn?: string;
    category?: string;
    categoryBn?: string;
    location?: string;
    locationBn?: string;
    uploaderName?: string;
    description?: string;
  }) => {
    const res = await fetch(`${API_BASE}/gallery/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateGalleryPhoto: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  likeGalleryPhoto: async (id: string) => {
    const res = await fetch(`${API_BASE}/gallery/${id}/like`, {
      method: 'POST'
    });
    return res.json();
  },

  deleteGalleryPhoto: async (id: string) => {
    const res = await fetch(`${API_BASE}/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Advertisements & Banners
  getAdvertisements: async (position?: string, activeOnly = true) => {
    let url = `${API_BASE}/advertisements?activeOnly=${activeOnly}`;
    if (position && position !== 'all') {
      url += `&position=${position}`;
    }
    const res = await fetch(url);
    return res.json();
  },

  getAdsterraConfig: async () => {
    const res = await fetch(`${API_BASE}/advertisements/adsterra-config`);
    return res.json();
  },

  updateAdsterraConfig: async (config: any) => {
    const res = await fetch(`${API_BASE}/advertisements/adsterra-config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(config)
    });
    return res.json();
  },

  createAdvertisement: async (data: any) => {
    const res = await fetch(`${API_BASE}/advertisements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateAdvertisement: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/advertisements/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  trackAdClick: async (id: string) => {
    const res = await fetch(`${API_BASE}/advertisements/${id}/click`, {
      method: 'POST'
    });
    return res.json();
  },

  trackAdImpression: async (id: string) => {
    const res = await fetch(`${API_BASE}/advertisements/${id}/impression`, {
      method: 'POST'
    });
    return res.json();
  },

  deleteAdvertisement: async (id: string) => {
    const res = await fetch(`${API_BASE}/advertisements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // School
  getStudents: async () => {
    const res = await fetch(`${API_BASE}/schools/students`);
    return res.json();
  },

  createStudent: async (data: any) => {
    const res = await fetch(`${API_BASE}/schools/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateStudent: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/schools/students/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteStudent: async (id: string) => {
    const res = await fetch(`${API_BASE}/schools/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Matrimonial Biodatas
  getBiodatas: async () => {
    const res = await fetch(`${API_BASE}/marriage/profiles`);
    return res.json();
  },

  getMarriageProfiles: async () => {
    const res = await fetch(`${API_BASE}/marriage/profiles`);
    return res.json();
  },

  createMarriageProfile: async (data: any) => {
    const res = await fetch(`${API_BASE}/marriage/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateMarriageProfile: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/marriage/profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteMarriageProfile: async (id: string) => {
    const res = await fetch(`${API_BASE}/marriage/profiles/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Branches & Executive Committees
  getBranches: async (params?: { status?: string; district?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const res = await fetch(`${API_BASE}/branches${query}`);
    return res.json();
  },

  getBranchById: async (id: string) => {
    const res = await fetch(`${API_BASE}/branches/${id}`);
    return res.json();
  },

  createBranch: async (data: any) => {
    const res = await fetch(`${API_BASE}/branches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateBranch: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/branches/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteBranch: async (id: string) => {
    const res = await fetch(`${API_BASE}/branches/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  approveBranch: async (id: string) => {
    const res = await fetch(`${API_BASE}/branches/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return res.json();
  },

  togglePublishCommittee: async (id: string) => {
    const res = await fetch(`${API_BASE}/branches/${id}/toggle-publish-committee`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return res.json();
  },

  addCommitteeMember: async (branchId: string, memberData: any) => {
    const res = await fetch(`${API_BASE}/branches/${branchId}/committee/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(memberData)
    });
    return res.json();
  },

  updateCommitteeMember: async (branchId: string, memberId: string, memberData: any) => {
    const res = await fetch(`${API_BASE}/branches/${branchId}/committee/members/${memberId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(memberData)
    });
    return res.json();
  },

  deleteCommitteeMember: async (branchId: string, memberId: string) => {
    const res = await fetch(`${API_BASE}/branches/${branchId}/committee/members/${memberId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Blood Bank
  getDonors: async (params?: { bloodGroup?: string; district?: string; upazila?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/blood-bank/donors?${query}`);
    return res.json();
  },

  registerDonor: async (data: any) => {
    const res = await fetch(`${API_BASE}/blood-bank/donors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateDonor: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/blood-bank/donors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteDonor: async (id: string) => {
    const res = await fetch(`${API_BASE}/blood-bank/donors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  getBloodRequests: async () => {
    const res = await fetch(`${API_BASE}/blood-bank/requests`);
    return res.json();
  },

  createBloodRequest: async (data: any) => {
    const res = await fetch(`${API_BASE}/blood-bank/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateBloodRequest: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/blood-bank/requests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteBloodRequest: async (id: string) => {
    const res = await fetch(`${API_BASE}/blood-bank/requests/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Blood Bank Committee & Coordinators
  getBloodCommittees: async (params?: { district?: string; upazila?: string; roleType?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/blood-bank/committees?${query}`);
    return res.json();
  },

  createBloodCommittee: async (data: any) => {
    const res = await fetch(`${API_BASE}/blood-bank/committees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateBloodCommittee: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/blood-bank/committees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteBloodCommittee: async (id: string) => {
    const res = await fetch(`${API_BASE}/blood-bank/committees/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // ==========================================
  // MULTI BLOOD BANK HUB ENTERPRISE API
  // ==========================================
  getBloodHubStats: async () => {
    const res = await fetch(`${API_BASE}/blood-hub/stats`);
    return res.json();
  },

  getBloodHubOrganizations: async (params?: { division?: string; district?: string; search?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const res = await fetch(`${API_BASE}/blood-hub/organizations${query}`);
    return res.json();
  },

  createBloodHubOrganization: async (data: any) => {
    const res = await fetch(`${API_BASE}/blood-hub/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateBloodHubOrganization: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/blood-hub/organizations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getBloodHubStocks: async (params?: { bloodBankId?: string; bloodGroup?: string; component?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const res = await fetch(`${API_BASE}/blood-hub/stocks${query}`);
    return res.json();
  },

  updateBloodHubStock: async (data: any) => {
    const res = await fetch(`${API_BASE}/blood-hub/stocks/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getBloodHubDonors: async (params?: { bloodGroup?: string; district?: string; upazila?: string; bloodBankId?: string; availableOnly?: string; search?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const res = await fetch(`${API_BASE}/blood-hub/donors${query}`);
    return res.json();
  },

  registerBloodHubDonor: async (data: any) => {
    const res = await fetch(`${API_BASE}/blood-hub/donors/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getBloodHubRequisitions: async (params?: { status?: string; urgency?: string; district?: string; bloodGroup?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const res = await fetch(`${API_BASE}/blood-hub/requisitions${query}`);
    return res.json();
  },

  createBloodHubRequisition: async (data: any) => {
    const res = await fetch(`${API_BASE}/blood-hub/requisitions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  fulfillBloodHubRequisition: async (id: string, data: { bagsFulfilled?: number; status?: string }) => {
    const res = await fetch(`${API_BASE}/blood-hub/requisitions/${id}/fulfill`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getBloodHubTransfers: async () => {
    const res = await fetch(`${API_BASE}/blood-hub/transfers`);
    return res.json();
  },

  createBloodHubTransfer: async (data: any) => {
    const res = await fetch(`${API_BASE}/blood-hub/transfers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getBloodHubCamps: async () => {
    const res = await fetch(`${API_BASE}/blood-hub/camps`);
    return res.json();
  },

  createBloodHubCamp: async (data: any) => {
    const res = await fetch(`${API_BASE}/blood-hub/camps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  registerDonorForBloodCamp: async (campId: string) => {
    const res = await fetch(`${API_BASE}/blood-hub/camps/${campId}/register-donor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return res.json();
  },

  getBloodHubThalassaemia: async () => {
    const res = await fetch(`${API_BASE}/blood-hub/thalassaemia`);
    return res.json();
  },

  createBloodHubThalassaemiaPatient: async (data: any) => {
    const res = await fetch(`${API_BASE}/blood-hub/thalassaemia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Donations & Comprehensive Philanthropy System
  getDonationSummary: async () => {
    const res = await fetch(`${API_BASE}/donations/summary`);
    return res.json();
  },

  getDonationCategories: async () => {
    const res = await fetch(`${API_BASE}/donations/categories`);
    return res.json();
  },

  getEmergencyAppeals: async () => {
    const res = await fetch(`${API_BASE}/donations/appeals`);
    return res.json();
  },

  createEmergencyAppeal: async (data: any) => {
    const res = await fetch(`${API_BASE}/donations/appeals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateEmergencyAppeal: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/donations/appeals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteEmergencyAppeal: async (id: string) => {
    const res = await fetch(`${API_BASE}/donations/appeals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  getDonationProjects: async (params?: { status?: string; category?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const res = await fetch(`${API_BASE}/donations/projects${query}`);
    return res.json();
  },

  createDonationProject: async (data: any) => {
    const res = await fetch(`${API_BASE}/donations/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateDonationProject: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/donations/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteDonationProject: async (id: string) => {
    const res = await fetch(`${API_BASE}/donations/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Backward compatible Campaign methods
  getCampaigns: async () => {
    const res = await fetch(`${API_BASE}/donations/projects`);
    return res.json();
  },

  createCampaign: async (data: any) => {
    const res = await fetch(`${API_BASE}/donations/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateCampaign: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/donations/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteCampaign: async (id: string) => {
    const res = await fetch(`${API_BASE}/donations/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  getDonationTransactions: async (params?: { status?: string; category?: string }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const res = await fetch(`${API_BASE}/donations/transactions${query}`);
    return res.json();
  },

  createDonation: async (data: any) => {
    const res = await fetch(`${API_BASE}/donations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit donation');
    }
    return res.json();
  },

  approveDonationTransaction: async (id: string) => {
    const res = await fetch(`${API_BASE}/donations/transactions/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeader()
    });
    return res.json();
  },

  deleteDonationTransaction: async (id: string) => {
    const res = await fetch(`${API_BASE}/donations/transactions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  verifyDonationReceipt: async (query: string) => {
    const res = await fetch(`${API_BASE}/donations/verify/${encodeURIComponent(query)}`);
    return res.json();
  },

  getDonationExpenses: async () => {
    const res = await fetch(`${API_BASE}/donations/expenses`);
    return res.json();
  },

  createDonationExpense: async (data: any) => {
    const res = await fetch(`${API_BASE}/donations/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateDonationExpense: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/donations/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteDonationExpense: async (id: string) => {
    const res = await fetch(`${API_BASE}/donations/expenses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  getDonorWall: async () => {
    const res = await fetch(`${API_BASE}/donations/donor-wall`);
    return res.json();
  },

  // Volunteers
  getVolunteers: async () => {
    const res = await fetch(`${API_BASE}/volunteers`);
    return res.json();
  },

  registerVolunteer: async (data: any) => {
    const res = await fetch(`${API_BASE}/volunteers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateVolunteer: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/volunteers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteVolunteer: async (id: string) => {
    const res = await fetch(`${API_BASE}/volunteers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Courses
  getCourses: async () => {
    const res = await fetch(`${API_BASE}/courses`);
    return res.json();
  },

  createCourse: async (data: any) => {
    const res = await fetch(`${API_BASE}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateCourse: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteCourse: async (id: string) => {
    const res = await fetch(`${API_BASE}/courses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Somiti & Loans
  getLoans: async () => {
    const res = await fetch(`${API_BASE}/somiti/loans`);
    return res.json();
  },

  applyLoan: async (data: any) => {
    const res = await fetch(`${API_BASE}/somiti/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateLoan: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/somiti/loans/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteLoan: async (id: string) => {
    const res = await fetch(`${API_BASE}/somiti/loans/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  approveLoan: async (id: string) => {
    const res = await fetch(`${API_BASE}/somiti/loans/${id}/approve`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Marketplace & Commission
  getProducts: async () => {
    const res = await fetch(`${API_BASE}/marketplace/products`);
    return res.json();
  },

  getVendors: async () => {
    const res = await fetch(`${API_BASE}/marketplace/vendors`);
    return res.json();
  },

  createVendor: async (data: any) => {
    const res = await fetch(`${API_BASE}/marketplace/vendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getBundles: async () => {
    const res = await fetch(`${API_BASE}/marketplace/bundles`);
    return res.json();
  },

  createBundle: async (data: any) => {
    const res = await fetch(`${API_BASE}/marketplace/bundles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getMarketplaceOrders: async (params?: { vendorId?: string; buyerPhone?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/marketplace/orders${query ? `?${query}` : ''}`);
    return res.json();
  },

  createProduct: async (data: any) => {
    const res = await fetch(`${API_BASE}/marketplace/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateProduct: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/marketplace/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteProduct: async (id: string) => {
    const res = await fetch(`${API_BASE}/marketplace/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  placeOrder: async (data: any) => {
    const res = await fetch(`${API_BASE}/marketplace/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  validateCoupon: async (data: { code: string; totalAmount: number }) => {
    const res = await fetch(`${API_BASE}/marketplace/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  lookupDigitalVault: async (params: { phone?: string; orderId?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/marketplace/vault/lookup?${query}`);
    return res.json();
  },

  submitProductReview: async (productId: string, data: { author: string; rating: number; comment: string; verifiedBuyer?: boolean }) => {
    const res = await fetch(`${API_BASE}/marketplace/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  askMarketplaceAiRobot: async (data: { message: string; productId?: string; history?: any[] }) => {
    const res = await fetch(`${API_BASE}/marketplace/ai-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  askProductQuestion: async (productId: string, data: { question: string; askerName?: string }) => {
    const res = await fetch(`${API_BASE}/marketplace/products/${productId}/ask-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getProductQa: async (productId: string) => {
    const res = await fetch(`${API_BASE}/marketplace/products/${productId}/qa`);
    return res.json();
  },

  // Real Estate
  getProperties: async () => {
    const res = await fetch(`${API_BASE}/real-estate/properties`);
    return res.json();
  },

  createProperty: async (data: any) => {
    const res = await fetch(`${API_BASE}/real-estate/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateProperty: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/real-estate/properties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteProperty: async (id: string) => {
    const res = await fetch(`${API_BASE}/real-estate/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  verifyProperty: async (id: string) => {
    const res = await fetch(`${API_BASE}/real-estate/properties/${id}/verify`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Navigation Menus CRUD
  getMenus: async () => {
    const res = await fetch(`${API_BASE}/menus`);
    return res.json();
  },

  createMenu: async (data: any) => {
    const res = await fetch(`${API_BASE}/menus`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateMenu: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/menus/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteMenu: async (id: string) => {
    const res = await fetch(`${API_BASE}/menus/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  toggleMenu: async (id: string) => {
    const res = await fetch(`${API_BASE}/menus/toggle/${id}`, {
      method: 'PUT',
      headers: getAuthHeader()
    });
    return res.json();
  },

  resetMenus: async () => {
    const res = await fetch(`${API_BASE}/menus/reset`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Export / Backup & Reset System
  exportBackup: async () => {
    const res = await fetch(`${API_BASE}/system/backup`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  resetSystemData: async () => {
    const res = await fetch(`${API_BASE}/system/reset`, {
      method: 'POST',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // CMS Notices
  getNotices: async () => {
    const res = await fetch(`${API_BASE}/cms/notices`);
    return res.json();
  },

  createNotice: async (data: any) => {
    const res = await fetch(`${API_BASE}/cms/notices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateNotice: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/cms/notices/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteNotice: async (id: string) => {
    const res = await fetch(`${API_BASE}/cms/notices/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Audit Logs
  getAuditLogs: async () => {
    const res = await fetch(`${API_BASE}/audit-logs`);
    return res.json();
  },

  // System Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  updateSettings: async (data: any) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // ==========================================
  // MEDICAL COURSES & INSTITUTE APIS
  // ==========================================
  getMedicalInstituteInfo: async () => {
    const res = await fetch(`${API_BASE}/medical/institute-info`);
    return res.json();
  },

  getMedicalCourses: async () => {
    const res = await fetch(`${API_BASE}/medical/courses`);
    return res.json();
  },

  getMedicalCourseById: async (id: string) => {
    const res = await fetch(`${API_BASE}/medical/courses/${id}`);
    return res.json();
  },

  createMedicalCourse: async (data: any) => {
    const res = await fetch(`${API_BASE}/medical/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateMedicalCourse: async (id: string, data: any) => {
    const res = await fetch(`${API_BASE}/medical/courses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  deleteMedicalCourse: async (id: string) => {
    const res = await fetch(`${API_BASE}/medical/courses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Medical Admissions
  getMedicalAdmissions: async () => {
    const res = await fetch(`${API_BASE}/medical/admissions`);
    return res.json();
  },

  submitMedicalAdmission: async (data: any) => {
    const res = await fetch(`${API_BASE}/medical/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateMedicalAdmissionStatus: async (id: string, data: { status: string; assignedRoll?: string; assignedRegNo?: string }) => {
    const res = await fetch(`${API_BASE}/medical/admissions/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Medical Students & Verification
  getMedicalStudents: async () => {
    const res = await fetch(`${API_BASE}/medical/students`);
    return res.json();
  },

  getMedicalStudentById: async (id: string) => {
    const res = await fetch(`${API_BASE}/medical/students/${id}`);
    return res.json();
  },

  getMedicalCertificates: async () => {
    const res = await fetch(`${API_BASE}/medical/certificates`);
    return res.json();
  },

  issueMedicalCertificate: async (data: any) => {
    const res = await fetch(`${API_BASE}/medical/certificates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  verifyMedicalRecord: async (query: string) => {
    const res = await fetch(`${API_BASE}/medical/verify/${encodeURIComponent(query)}`);
    return res.json();
  },

  getMedicalIdCard: async (query: string) => {
    const res = await fetch(`${API_BASE}/medical/idcard/${encodeURIComponent(query)}`);
    return res.json();
  },

  getMedicalAdmitCard: async (query: string) => {
    const res = await fetch(`${API_BASE}/medical/admitcard/${encodeURIComponent(query)}`);
    return res.json();
  },

  getMedicalRegCard: async (query: string) => {
    const res = await fetch(`${API_BASE}/medical/regcard/${encodeURIComponent(query)}`);
    return res.json();
  }
};
