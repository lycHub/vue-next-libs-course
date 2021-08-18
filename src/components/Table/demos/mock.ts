import {TableData} from "../types";

export function genTableData(count = 3): TableData[] {
  return Array(count).fill('').map((item, index) => ({
    id: index,
    name: '张三' + index,
    age: 18,
    address: 'New York No. 1 Lake Park',
    province: 'America',
    city: 'New York',
    zip: 100000
  }));
}
