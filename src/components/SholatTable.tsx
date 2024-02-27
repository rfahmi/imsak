import React from 'react';
import {StyleSheet} from 'react-native';
import {SquircleView} from 'react-native-figma-squircle';
import {Colors, ListItem, Text, View} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {stringToProperCase} from '../utils/string';

interface SholatTableProps {
  data: any[];
}

const SholatTable: React.FC<SholatTableProps> = ({data}) => {
  return (
    <SquircleView
      style={{flex: 1, padding: 24}}
      squircleParams={{
        cornerSmoothing: 1,
        cornerRadius: 30,
        fillColor: Colors.white,
      }}>
      <Text text60BO marginB-10 black>
        Waktu Sholat
      </Text>
      {data &&
        data.map((item, index) => (
          <ListItem key={index} activeOpacity={0.3}>
            <ListItem.Part middle row>
              <ListItem.Part>
                <Text flex grey10 text70 marginL-10 numberOfLines={1}>
                  {stringToProperCase(item.label)}
                </Text>
                <Text flex style={{textAlign: 'center'}} grey10 text70>
                  {`${item.icon} ${item.time}`}
                </Text>
                <View flex row right>
                  {item.weather && (
                    <Icon
                      name={item.weather.icon}
                      size={20}
                      color={Colors.grey10}
                    />
                  )}
                </View>
              </ListItem.Part>
            </ListItem.Part>
          </ListItem>
        ))}
    </SquircleView>
  );
};

export default SholatTable;
