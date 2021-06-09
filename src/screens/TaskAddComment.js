import React, {Component} from 'react';
import {action, observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import {View} from 'react-native';

import commonStyles from 'styles';
import screensId from '../navigation/screensId';
import locale from 'locale';
import requests from '../network/requests';
import inputTypes from '../forms/inputTypes';

import AddCommentForm from '../forms/addCommentForm';

@inject('navigationStore')
@observer
class TaskAddCommentScreen extends Component {
  static options() {
    return {
      id: screensId.TASK_ADD_COMMENT,
      topBar: {
        visible: true,
        title: {
          text: locale.ru.comment_adding,
        },
      },
    };
  }

  @observable
  isFormSubmitting = false;

  @action
  handleSubmit = async values => {
    const {taskData, successCallback, navigationStore} = this.props;
    if (!this.isFormSubmitting && taskData) {
      try {
        this.isFormSubmitting = true;
        const response = await requests.taskAddComment(
          taskData.id,
          values[inputTypes.comment],
        );
        console.log(response);
        if (response.data.result) {
          if (successCallback) {
            successCallback();
          }
          navigationStore.popScreen();
        }
        this.isFormSubmitting = false;
      } catch (e) {
        this.isFormSubmitting = false;
        console.log(e.response || e);
      }
    }
  };

  handleBackPress = () => {
    this.props.navigationStore.popScreen();
  };

  render() {
    return (
      <View style={commonStyles.common.screenWrapper}>
        <AddCommentForm
          isSubmitting={this.isFormSubmitting}
          onSubmit={this.handleSubmit}
          onBackPress={this.handleBackPress}
        />
      </View>
    );
  }
}

export default TaskAddCommentScreen;
