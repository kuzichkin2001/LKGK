import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import {action, observable, toJS} from 'mobx';

import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';

import ScreenWrapper from '../components/ScreenWrapper';
import DelegationList from '../components/lists/delegationList';
import LargeSubmitButton from '../components/buttons/largeSubmitButton';

@inject('navigationStore', 'profileStore')
@observer
class DelegationListScreen extends Component {
  static options() {
    return {
      id: screensId.DELEGATION_LIST,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.title_authority_delegation,
        },
      },
    };
  }

  static delegationTypes = {
    fromMe: 'from_me',
    toMe: 'to_me',
  };

  @observable
  delegationLists = {
    [DelegationListScreen.delegationTypes.fromMe]: {
      nextPage: 1,
      data: [],
      isLoading: false,
    },
    [DelegationListScreen.delegationTypes.toMe]: {
      nextPage: 1,
      data: [],
      isLoading: false,
    },
  };

  @observable
  delegationListType = DelegationListScreen.delegationTypes.toMe;

  @action
  getDelegationsList = async (isRefresh, delegationType) => {
    if (!this.delegationLists[delegationType].isLoading) {
      try {
        if (isRefresh) {
          this.delegationLists[delegationType].nextPage = 1;
          this.delegationLists[delegationType].data = [];
        } else if (!this.delegationLists[delegationType].nextPage) {
          return;
        }
        this.delegationLists[delegationType].isLoading = true;
        const response = await requests.delegations(
          this.delegationLists[delegationType].nextPage,
          delegationType === DelegationListScreen.delegationTypes.toMe,
        );
        console.log('delegation lists response');
        console.log(response);
        console.log(toJS(this.delegationLists[delegationType]));
        const {links, data, result} = response.data;
        if (result) {
          const currentListData = this.delegationLists[delegationType];
          this.delegationLists[delegationType] = {
            ...currentListData,
            data: isRefresh
              ? data
              : [
                  ...currentListData.data,
                  ...data.filter(
                    newDelegation =>
                      !currentListData.data.find(
                        oldDelegation => oldDelegation.id === newDelegation.id,
                      ),
                  ),
                ],
            nextPage: links.next ? currentListData.nextPage + 1 : null,
            isLoading: false,
          };
          console.log(toJS(this.delegationLists[delegationType]));
        } else {
          this.delegationLists[delegationType].isLoading = false;
        }
      } catch (e) {
        this.delegationLists[delegationType].isLoading = false;
        console.log(e.response || e);
      }
    }
  };

  handleDelegationPress = delegationData => {
    const isInitiator =
      delegationData.from_whom &&
      delegationData.from_whom.id_phperson ===
        this.props.profileStore.userData.id_phperson;
    this.props.navigationStore.pushScreen(screensId.DELEGATION_INFO, {
      delegationData,
      isInitiator,
      onStatusChange: () => {
        this.getDelegationsList(true, this.delegationListType);
      },
    });
  };

  @action
  handleDelegationTypePress = type => {
    this.delegationListType = type;
    this.getDelegationsList(true, type);
  };

  handleCreatePress = () => {
    this.props.navigationStore.pushScreen(screensId.DELEGATION_CREATE, {
      onSuccessCreate: () => {
        this.handleDelegationTypePress(
          DelegationListScreen.delegationTypes.fromMe,
        );
        this.getDelegationsList(
          true,
          DelegationListScreen.delegationTypes.fromMe,
        );
      },
    });
  };

  componentDidMount(): void {
    this.getDelegationsList(true, this.delegationListType);
    this.removeTopBarButtonListener = this.props.navigationStore.addTopBarButtonListener(
      screensId.DELEGATION_LIST,
      this.handleCreatePress,
    );
  }

  componentWillUnmount(): void {
    try {
      this.removeTopBarButtonListener();
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <ScreenWrapper>
        <DelegationList
          onDelegationTypePress={this.handleDelegationTypePress}
          onPress={this.handleDelegationPress}
          type={this.delegationListType}
          refreshing={this.delegationLists[this.delegationListType].isLoading}
          onEndReached={() =>
            this.getDelegationsList(false, this.delegationListType)
          }
          onRefresh={() =>
            this.getDelegationsList(true, this.delegationListType)
          }
          data={toJS(this.delegationLists[this.delegationListType].data)}
        />
        <LargeSubmitButton
          onPress={this.handleCreatePress}
          title={locale.ru.create_delegated_rule}
        />
      </ScreenWrapper>
    );
  }
}

export default DelegationListScreen;
