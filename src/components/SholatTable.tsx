import React from 'react';
import {StyleSheet} from 'react-native';
import {Card, Colors, ListItem, Text} from 'react-native-ui-lib';
import {stringToProperCase} from '../utils/string';

interface SholatTableProps {
  data: any[];
}

const SholatTable: React.FC<SholatTableProps> = ({data}) => {
  return (
    <Card marginT-20 padding-16 enableBlur enableShadow borderRadius={24}>
      <Text text60BO marginB-10 black>
        Waktu Sholat
      </Text>
      {data.map((item, index) => (
        <ListItem key={index} activeOpacity={0.3}>
          <ListItem.Part
            middle
            row
            containerStyle={{
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderColor: Colors.grey50,
            }}>
            <ListItem.Part>
              <Text flex grey10 text70 marginL-10 numberOfLines={1}>
                {stringToProperCase(item.label)}
              </Text>
              <Text flex style={{textAlign: 'center'}} grey10 text70>
                {`${item.time} ${item.icon}`}
              </Text>
              <Text flex style={{textAlign: 'right'}} grey10 text70>
                {item.weather}
              </Text>
            </ListItem.Part>
          </ListItem.Part>
        </ListItem>
      ))}
    </Card>
  );
};

export default SholatTable;

const styles = StyleSheet.create({});
