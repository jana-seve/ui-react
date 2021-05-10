import { ApiRequest, ILocation } from '@covid-essentials/shared/utils';

async function getOrganization(id) {
  if (id === '__new__') {
    return {
      name: '',
      state: 'Karnataka',
      city: 'Bengaluru',
      area: '',
      address: '',
      org_name: '',
      org_type: 'ngo',
      email: [''],
      phone: [''],
      pin_code: null,
      latitude: null,
      longitude: null,
    };
  }

  const res = await ApiRequest.get(`/api/organizations/${id}`);
  return res.data.result;
}

async function createOrganization(data) {
  const res = await ApiRequest.post('/api/organizations/', data);
  return res.data.result;
}

async function updateOrganization(data) {
  const res = await ApiRequest.put(`/api/organizations/${data.id}`, data);
  return res.data.result;
}

async function getResources(orgId) {
  const res = await ApiRequest.get(`/api/organizations/${orgId}/resources`);
  return res.data.result;
}

async function createResource(orgId, data) {
  const res = await ApiRequest.post(
    `/api/organizations/${orgId}/resources`,
    data
  );
  return res.data.result;
}

async function updateResource(orgId, data) {
  const res = await ApiRequest.put(
    `/api/organizations/${orgId}/resources/${data.id}`,
    data
  );
  return res.data.result;
}

export {
  getOrganization,
  createOrganization,
  updateOrganization,
  getResources,
  createResource,
  updateResource,
};
