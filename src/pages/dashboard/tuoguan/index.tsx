import {
  FooterToolbar,
  GridContent,
  ModalForm,
  PageContainer, ProDescriptions, ProDescriptionsItemProps,
  ProFormText,
  ProFormTextArea,
  ProTable
} from '@ant-design/pro-components';
import {Outlet, useRequest} from '@umijs/max';
import {Button, Card, Col, Drawer, Dropdown, Flex, Input, Radio, Row, Table} from 'antd';
import type {RangePickerProps} from 'antd/es/date-picker/generatePicker';
import type {RadioChangeEvent} from 'antd/es/radio';
import type dayjs from 'dayjs';
import type {FC} from 'react';
import React, {Suspense, useState, useEffect} from 'react';
import type {AnalysisData} from './data.d';
import {fetchData, descData, DBHostDESC} from '../../../utils/duckDBTools'
import {Pie} from '@ant-design/charts';


type RangePickerValue = RangePickerProps<dayjs.Dayjs>['value'];
type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};
type SalesType = 'all' | 'online' | 'stores';
const Analysis: FC<AnalysisProps> = () => {

  const [mgmtSource, setMgmtSource] = useState([])
  const [custodianSource, setCustodianSource] = useState([])
  useEffect(() => {
    getData()
  }, [])


  const getData = async () => {
    const sql = `  SELECT * FROM '${DBHostDESC}'`
    let descData = await fetchData(sql)
    let mgmtMap = new Map()
    let custodianMap = new Map()
    descData.map((item) => {
      let count = mgmtMap.get(item.mgmt)?.count || 0
      let arr = mgmtMap.get(item.mgmt)?.arr || []
      mgmtMap.set(item.mgmt, {count: ++count, arr: [item, ...arr]})

      let count2 = custodianMap.get(item.custodian)?.count || 0
      let arr2 = custodianMap.get(item.custodian)?.arr || []
      custodianMap.set(item.custodian, {count: ++count2, arr: [item, ...arr2]})
    })
    let mgmtArr = Array.from(mgmtMap.values())?.sort((a, b) => {
      return b?.count - a?.count
    }).slice(0, 10).map((item) => {
      return {type: item.arr?.[0]?.mgmt, value: item.count}
    })
    let custodianArr = Array.from(custodianMap.values())?.sort((a, b) => {
      return b?.count - a?.count
    }).slice(0, 10).map((item) => {
      return {type: item.arr?.[0]?.custodian, value: item.count}
    })
    console.log(mgmtArr)
    setMgmtSource(mgmtArr)
    setCustodianSource(custodianArr)
  }

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Pie
              title={'管理人基金数量'}
              angleField="value"
              colorField="type"
              data={mgmtSource}
              description={{visible: false}}
              legend={false}
              tooltip={{
                title: 'type',
                items: [{name: '持有数量', field: 'value'}]
              }}
              label={{
                position: 'spider',
                visible: true,
                formatter: (text, item) => {
                  return `${item.type}:${item.value}`
                }
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Pie
              title={'托管人基金数量'}
              autoFit
              angleField="value"
              colorField="type"
              data={custodianSource}
              legend={false}
              tooltip={{
                title: 'type',
                items: [{name: '持有数量', field: 'value'}]
              }}
              label={{
                position: 'spider',
                visible: true,
                formatter: (text, item) => {
                  return `${item.type}:${item.value}`
                }
              }}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};
export default Analysis;
