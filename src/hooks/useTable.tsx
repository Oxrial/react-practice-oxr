import { useRef, useState } from 'react'
import type { ColumnType } from 'antd/es/table'
import { Table as ATable } from 'antd'
import { buildPrefixReuslt } from '@/util'
interface UseTableAttrs {
	page?: {
		current?: number
		pageSize?: number
		total?: number
		[key: string]: any
	}
	[key: string]: any
}

type PageChangeCallback = (page: number, pageSize: number) => void

type BaseUseTableReturn = {
	tableRef: React.RefObject<any>
	columns: ColumnType<any>[]
	tableData: any[]
	current: number
	pageSize: number
	total: number
	setColumns: (columns: ColumnType<any>[]) => void
	setTableData: (data: any[]) => void
	setCurrent: (current: number) => void
	setPageSize: (pageSize: number) => void
	setTotal: (total: number) => void
	TableTemplate: JSX.Element
}

// 改进的类型定义：更精确地处理前缀类型映射
// prettier-ignore
type PrefixedUseTableReturn<Prefix extends string | undefined> = Prefix extends string
	? {
			// 小驼峰基础属性
			[K in keyof Pick<
				BaseUseTableReturn,
				'tableRef' | 'columns' | 'tableData' | 'current' | 'pageSize' | 'total'
			> as `${Lowercase<Prefix>}${Capitalize<K>}`]: BaseUseTableReturn[K]
	} & {
			// 大驼峰 setter 方法
			[K in keyof Pick<
				BaseUseTableReturn,
				'setColumns' | 'setTableData' | 'setCurrent' | 'setPageSize' | 'setTotal'
			> as `set${Capitalize<Prefix>}${K extends `set${infer R}` ? Capitalize<R> : never}`]: BaseUseTableReturn[K]
	} & {
			// TableTemplate 属性
			[K in keyof Pick<BaseUseTableReturn, 'TableTemplate'> as `${Capitalize<Prefix>}TableTemplate`]: JSX.Element
	}
	: BaseUseTableReturn

// 使用泛型捕获前缀的字面量类型
const useTable = <Prefix extends string | undefined = undefined>(
	_columns: ColumnType<any>[],
	_data: any[],
	$attrs: UseTableAttrs & { prefix?: Prefix } = {},
	pageChangeCallback?: PageChangeCallback
): PrefixedUseTableReturn<Prefix> => {
	const tableRef = useRef<any>(null)
	const [columns, setColumns] = useState(_columns)
	const [tableData, setTableData] = useState(_data)
	const [current, setCurrent] = useState($attrs?.page?.current || 1)
	const [pageSize, setPageSize] = useState($attrs?.page?.pageSize || 10)
	const [total, setTotal] = useState($attrs?.page?.total || 0)

	const TableTemplate = (
		<ATable
			ref={tableRef}
			columns={columns}
			dataSource={tableData}
			pagination={{
				current,
				pageSize,
				total,
				className: 'use-table-pagination',
				showTotal: (total) => `Total ${total} items`,
				showSizeChanger: true,
				showQuickJumper: true,
				onChange: (page, size) => {
					setCurrent(page)
					pageChangeCallback?.(page, size)
				},
				onShowSizeChange: (page, size) => {
					setCurrent(page)
					setPageSize(size)
					pageChangeCallback?.(page, size)
				},
				...($attrs?.page || {})
			}}
			{...$attrs}
		/>
	)

	// 构建基础返回值
	const result: BaseUseTableReturn = {
		tableRef,
		columns,
		tableData,
		current,
		pageSize,
		total,
		setColumns,
		setTableData,
		setCurrent,
		setPageSize,
		setTotal,
		TableTemplate
	}

	const prefix = $attrs?.prefix ? `_${$attrs.prefix}_` : ''

	// 有前缀时动态重命名属性
	if (prefix) {
		const baseKeys = ['tableRef', 'columns', 'tableData', 'current', 'pageSize', 'total'] as const
		const setterKeys = ['setColumns', 'setTableData', 'setCurrent', 'setPageSize', 'setTotal'] as const
		return buildPrefixReuslt(
			prefix,
			result,
			baseKeys,
			setterKeys,
			'TableTemplate'
		) as PrefixedUseTableReturn<Prefix>
	}

	// 无前缀时直接返回基础类型
	return result as PrefixedUseTableReturn<Prefix>
}

export default useTable
