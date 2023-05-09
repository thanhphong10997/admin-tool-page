import { fetchUtils } from "react-admin";
import { stringify } from "query-string";
import logProvider from "./LogProvider";

import { logAction } from "../emuns/logAction";
let adminApiUrl;
if (process.env.NODE_ENV === "development") {
  adminApiUrl = process.env.REACT_APP_ADMIN_API_DEV;
} else if (process.env.NODE_ENV === "production") {
  adminApiUrl = process.env.REACT_APP_ADMIN_API_PROD;
}

const apiUrl = adminApiUrl;
const httpClient = fetchUtils.fetchJson;

const dataProvider = {
  getList: async (resource, params) => {
    let action = logAction.GETLIST + "_" + resource.toString();
    logProvider.log(action, params);
    let query = {};
    let pageCurrent = params.pagination ? params.pagination.page : 1;
    let pageLimit = params.pagination ? params.pagination.perPage : 10;
    let filterAction = params.filter.action;
    // let filterName_APi = params.filter.q
    let filter = params.filter;
    let offset = (pageCurrent - 1) * pageLimit;
    query = {
      offset: offset,
      limit: pageLimit,
    };
    if (filterAction) {
      query.action = filterAction;
    }
    if (filter.phone) {
      query.phone = filter.phone;
    }
    if (filter.name_api) {
      query.name_api = filter.name_api;
    }
    if (filter.campaign_id) {
      query.campaign_id = filter.campaign_id;
    }
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { headers, json } = await httpClient(url);
    return {
      data: json.data.list,
      total: json.data.total,
    };
  },
  //get one
  getOne: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => {
      let action = logAction.GETONE + "_" + resource.toString();
      logProvider.log(action, params);
      return {
        data: json.data,
      };
    }),
  //get many
  getMany: async (resource, params) => {
    let action = logAction.GETMANY + "_" + resource.toString();
    logProvider.log(action, params);
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    return httpClient(url).then(({ json }) => ({ data: json }));
  },

  getManyReference: async (resource, params) => {
    let action = logAction.GETMANYREFERENCE + "_" + resource.toString();
    logProvider.log(action, params);
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    return httpClient(url).then(({ headers, json }) => ({
      data: json,
      total: parseInt(headers.get("content-range").split("/").pop(), 10),
    }));
  },
  //update
  update: async (resource, params) => {
    let action = logAction.UPDATE + "_" + resource.toString();
    logProvider.log(action, params);
    return httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => {
      return { data: json.data };
    });
  },

  updateMany: async (resource, params) => {
    let action = logAction.UPDATEMANY + "_" + resource.toString();
    logProvider.log(action, params);
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => {
      return { data: json.data };
    });
  },
  //create
  create: async (resource, params) => {
    let action = logAction.CREATE + "_" + resource.toString();
    logProvider.log(action, params);
    return httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => {
      return {
        response: json,
        data: { ...params.data, id: json.id },
      };
    });
  },
  //delete
  delete: (resource, params) => {
    let action = logAction.DELETE + "_" + resource.toString();
    logProvider.log(action, params);
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => {
      return { data: json.data };
    });
  },

  deleteMany: async (resource, params) => {
    let action = logAction.DELETEMANY + "_" + resource.toString();
    logProvider.log(action, params);
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
      method: "DELETE",
    }).then(({ json }) => {
      return { data: json.data };
    });
  },
};

export default dataProvider;
