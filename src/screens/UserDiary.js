import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import moment from 'moment';
import {observer} from 'mobx-react';
import {observable, action} from 'mobx';

import requests from '../network/requests';
import locale from '../locale';
import commonStyles from 'styles';

import ScreenWrapper from '../components/ScreenWrapper';
import screensId from '../navigation/screensId';
import Divider from '../components/divider';
import EmployeePickListItem from '../components/listsItems/employeePickListItem';
import TimeProgressItem from '../components/listsItems/timeProgressItem';
import UserDiaryProjectItem from '../components/listsItems/userDiaryProjectItem';
import TitledInfoRow from '../components/titledInfoRow';
import PeriodDatePickerButton from '../components/buttons/periodDatePickerButton';

@observer
class UserDiaryScreen extends Component {
  static colors = [
    commonStyles.colors.orange,
    commonStyles.colors.lightGray,
    commonStyles.colors.green,
  ];
  static options() {
    return {
      id: screensId.USER_DIARY,
      topBar: {
        title: {
          text: locale.ru.title_user_diary,
        },
      },
    };
  }

  componentDidMount() {
    this.getDiaryData();
  }

  @observable
  diary = null;

  @observable
  currentDate = moment();

  @observable
  apiError = '';

  @observable
  isLoading = true;

  @action
  handleDateChange = async date => {
    this.currentDate = await moment(date.date_start);
    this.handleRequest();
  };

  @action
  getDiaryData = (refresh = false) => {
    this.handleRequest();
  };

  handleRequest = () => {
    const {userData} = this.props;
    this.isLoading = true;
    this.apiError = null;
    this.diary = null;
    requests
      .diary(this.currentDate.format('YYYY-MM-DD'), userData.id_phperson)
      .then(response => {
        console.log('--DIARY--');
        console.log(response.data.data);
        this.diary = response.data.data;
        console.log('##');
        this.isLoading = false;
      })
      .catch(error => {
        console.log(error);
        switch (error.response.status) {
          case 500: {
            Alert.alert(error.response.data.error);
            break;
          }
          default: {
            this.apiError = error.response.data.error;
            break;
          }
        }
        this.isLoading = false;
      });
  };

  render() {
    const {userData} = this.props;

    const mainDiaryProgress =
      this.diary && this.diary.project_timers
        ? this.diary.project_timers.map((time, idx) => {
            return {value: time.labor, color: UserDiaryScreen.colors[idx]};
          })
        : [];

    return (
      <ScreenWrapper>
        <ScrollView>
          <PeriodDatePickerButton
            isSingleDate={true}
            onChangePeriod={this.handleDateChange}
            title={locale.ru.date}
            placeholder={this.currentDate.format('DD.MM.YYYY')}
            currentDate={this.currentDate}
          />

          {/* Employee header */}
          <Divider title={locale.ru.title_employees} />
          <EmployeePickListItem
            subtitle={true}
            wrapperStyle={styles.employeeWrapper}
            employeeData={userData}>
            {!!mainDiaryProgress.length && (
              <TimeProgressItem
                wrapperStyle={{paddingHorizontal: 0}}
                items={mainDiaryProgress}
              />
            )}
          </EmployeePickListItem>

          {this.isLoading && (
            <View style={{paddingVertical: 20}}>
              <ActivityIndicator />
            </View>
          )}

          {/* Process api response */}
          {this.apiError ? (
            <Text style={{padding: 15}}>{this.apiError}</Text>
          ) : (
            <>
              {this.diary && (
                <>
                  {/* diary global */}
                  {this.diary.global && (
                    <>
                      <Divider title={locale.ru.title_time_statistic} />
                      {Object.keys(this.diary.global).map(time => (
                        <TitledInfoRow
                          key={time}
                          icon={require('images/alarm.png')}
                          title={locale.ru[`diary_${time}`]}
                          value={moment
                            .duration(this.diary.global[time], 'seconds')
                            .format(
                              `H [${locale.ru.hours}] mm [${
                                locale.ru.minutes
                              }]`,
                            )}
                        />
                      ))}
                    </>
                  )}

                  {/* diary project */}
                  {this.diary.projects && this.diary.projects.length && (
                    <>
                      <Divider title={locale.ru.title_offices_tasks} />
                      {this.diary.projects.map(project => {
                        const projectTimers = [
                          {
                            value: project.work_time,
                            color: commonStyles.colors.green,
                          },
                        ];

                        if (project.no_work_time) {
                          projectTimers.push({
                            value: project.no_work_time,
                            color: commonStyles.colors.lightGray,
                          });
                        }

                        return (
                          <UserDiaryProjectItem
                            projectTimers={projectTimers}
                            project={project}
                          />
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  employeeWrapper: {
    borderTopWidth: 0.5,
    borderTopColor: commonStyles.colors.lightGray,
  },
});

export default UserDiaryScreen;
