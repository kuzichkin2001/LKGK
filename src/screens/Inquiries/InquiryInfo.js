import React, {Component} from 'react';
import {ScrollView, View, StyleSheet} from 'react-native';
import {inject, observer} from 'mobx-react';
import {action, observable} from 'mobx';

import ScreenWrapper from '../../components/ScreenWrapper';
import Divider from '../../components/divider';
import ScreenNetworkConnectionIndicator from '../../components/screenNetworkConnectionIndicator';
import TitledInfoRow from '../../components/titledInfoRow';
import TitledTextSingleRow from '../../components/titledTextSingleRow';

import screensId from '../../navigation/screensId';
import commonStyles from '../../styles';
import locale from '../../locale';
import requests from '../../network/requests';

import {showNetworkError} from '../../utils/showNetworkError';
import {showMessage} from '../../utils/showMessage';
import formatDate from '../../utils/formatDate';
import ApprovingTaskPinnedDocsList from '../../components/lists/approvingTaskPinnedDocsList';
import routes from '../../network/routes';

@inject('navigationStore')
@observer
class InquiryInfo extends Component {
  static options() {
    return {
      id: screensId.INQUIRY_INFO,
      topBar: {
        visible: true,
      },
    };
  }

  @observable
  inquiryData = null;

  @observable
  loadActivity = false;

  @action
  getInquiry = async (type, id) => {
    let response = null;
    let error_network = true;
    if (!this.loadActivity) {
      try {
        this.loadActivity = true;
        response = await requests.inquiryData(type, id); // !!!
        if (response && response.data.data) {
          this.inquiryData = response.data.data;
        } else {
          showNetworkError(response);
        }
        error_network = false;
        this.loadActivity = false;
      } catch (e) {
        if (error_network) {
          if (e && e.response) {
            showNetworkError(e.response);
          } else {
            showMessage(locale.ru.error, locale.ru.error_network);
          }
        } else {
          showMessage(locale.ru.error, locale.ru.error_data_processing);
        }
      } finally {
        this.loadActivity = false;
      }
    }
  };

  @action
  componentDidMount() {
    const {id, inquiryType} = this.props;
    try {
      this.getInquiry(inquiryType, id);
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    if (!this.inquiryData) {
      return (
        <View style={commonStyles.common.screenWrapper}>
          <ScreenNetworkConnectionIndicator />
        </View>
      );
    }

    const {
      number,
      theme,
      status: {text: status_text, color: status_color},
      count_instance,
    } = this.inquiryData;
    const {start, end} = this.inquiryData; // two-ndfl
    const {child, db_child, files} = this.inquiryData; // once-pension, no-pension
    const {check_zp, check_vac, english} = this.inquiryData; // from-job

    return (
      <ScreenWrapper>
        <ScrollView>
          <Divider title={locale.ru.main_info} />
          <TitledInfoRow
            icon={require('images/rows.png')}
            title={locale.ru.number}
            value={number}
          />
          <TitledInfoRow
            icon={require('images/rows.png')}
            title={locale.ru.description}
            value={theme}
          />
          <TitledInfoRow
            icon={require('images/status.png')}
            title={locale.ru.status}
            value={status_text}
          />
          <Divider title={locale.ru.inquiry_details} />
          {start && end && (
            <TitledTextSingleRow
              title={locale.ru.inquiry_period}
              value={`${start}-${end}`} // !!!
              showEmpty
            />
          )}
          {count_instance && (
            <TitledTextSingleRow
              title={locale.ru.amount_of_copies}
              value={count_instance}
              valueStyle={styles.textGray}
              showEmpty
            />
          )}
          {child && (
            <TitledInfoRow
              iconPlaceholder={false}
              title={locale.ru.child_fullName}
              value={child}
              titleStyle={styles.textBlue}
              valueStyle={styles.textGray}
            />
          )}
          {db_child && (
            <TitledTextSingleRow
              title={locale.ru.child_birthday}
              value={formatDate(db_child, 'D MMMM YYYY')}
              valueStyle={styles.textGray}
              showEmpty
            />
          )}
          {check_zp >= 0 && (
            <TitledTextSingleRow
              title={locale.ru.inquiry_specify_salary}
              value={locale.ru[check_zp ? 'true_yes' : 'false_no']}
              valueStyle={styles.textGray}
              showEmpty
            />
          )}
          {check_vac >= 0 && (
            <TitledTextSingleRow
              title={locale.ru.inquiry_specify_vacancy_term}
              value={locale.ru[check_vac ? 'true_yes' : 'false_no']}
              valueStyle={styles.textGray}
              showEmpty
            />
          )}
          {english >= 0 && (
            <TitledTextSingleRow
              title={locale.ru.inquiry_specify_english}
              value={locale.ru[english ? 'true_yes' : 'false_no']}
              valueStyle={styles.textGray}
              showEmpty
            />
          )}
          {files && (
            <ApprovingTaskPinnedDocsList
              // data={[{...files[0], file_name: files[0].name}]}
              data={files}
              downloadRoute={routes.kipFileDownload}
              filePrefix={ApprovingTaskPinnedDocsList.prefixes.inquiry}
              ListHeaderComponent={<Divider title={locale.ru.files} />}
            />
          )}
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  textBlue: {
    color: commonStyles.colors.valueBlue,
  },
  textGray: {
    color: commonStyles.colors.valueGray,
  },
});

export default InquiryInfo;
