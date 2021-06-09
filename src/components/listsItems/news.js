import React from 'react';
import {StyleSheet, View} from 'react-native';
import HTML from 'react-native-render-html';
import truncate from 'truncate-html';

import locale from 'locale';
import commonStyles from 'styles';
import openLink from '../../utils/openLink';

import TextButton from '../buttons/TextButton';
import ImagesSlider from '../imagesSlider';

const firstLineFill = '&nbsp;&nbsp;&nbsp;';

const paragraphsToLinebreaks = content =>
  `<p style="display: inline-block; text-align: justify;">${firstLineFill}`.concat(
    content.replace(/<\/p><p>/g, `<br><br>${firstLineFill}`).substr(3),
  );

const NewsListItem = ({data, onPress, isFullView}) => {
  // replacing <p> tags to <br> to place all text in one block so this allow to select all text
  const content = paragraphsToLinebreaks(data.content);

  return (
    <View style={[styles.wrapper, !isFullView && styles.wrapperVerticalOffset]}>
      <HTML
        onLinkPress={(e, href) => openLink(href)}
        baseFontStyle={commonStyles.texts.titleBig}
        html={data.title}
      />
      {!!data.images.length && (
        <View style={[styles.newsImage, commonStyles.common.topOffset]}>
          <ImagesSlider images={data.images} />
        </View>
      )}

      <HTML
        onLinkPress={(e, href) => openLink(href)}
        baseFontStyle={styles.contentText}
        html={isFullView ? content : truncate(data.content, 66)}
        defaultTextProps={{
          selectable: true,
        }}
      />

      {!isFullView && (
        <TextButton
          style={commonStyles.common.topOffset}
          onPress={onPress}
          title={locale.ru.read_more}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderTopColor: commonStyles.colors.lightGray,
    borderBottomColor: commonStyles.colors.lightGray,
    padding: 16,
    backgroundColor: commonStyles.colors.white,
  },
  wrapperVerticalOffset: {
    marginVertical: commonStyles.spaces.m,
  },
  newsImage: {
    width: '100%',
  },
  contentText: {
    ...commonStyles.texts.common,
    lineHeight: 17,
  },
  contentHtml: {
    maxHeight: 75,
    overflow: 'hidden',
    marginBottom: -10,
  },
});

export default NewsListItem;
