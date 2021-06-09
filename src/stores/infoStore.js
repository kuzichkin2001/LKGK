import {observable, action} from 'mobx';

import requests from '../network/requests';

class InfoStore {
  @observable
  officesList = null;

  @observable
  officesListActivity = false;

  @action
  updateOfficesList = async () => {
    if (!this.officesListActivity) {
      try {
        this.officesListActivity = true;
        const response = await requests.officesList();
        if (response.data.result) {
          this.officesList = response.data.data;
        }
        this.officesListActivity = false;
      } catch (e) {
        this.officesListActivity = false;
        console.log(e);
        console.log(e.response);
      }
    }
  };
}

export default new InfoStore();
