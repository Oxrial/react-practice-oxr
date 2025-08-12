import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import COMPONENTS from '@/components'
import { isNil, omit, pick } from 'lodash-es'
import { Form as AForm, Table as ATable } from 'antd'
import type { FormInstance } from 'antd/es/form/Form'
import type { FormListOperation } from 'antd'
import type { TableProps, ColumnType, ColumnGroupType } from 'antd/es/table'
import type { ReactNode } from 'react'

interface EditTableFormProps {
	form: FormInstance
	formName: string
	columns: ColumnType<any>[]
	data: any[]
	rowKey: string | ((record: any) => string)
	subRowKey?: string | ((record: any) => string)
	expandeable?: boolean
	nonPagination?: boolean
	pageOnChange?: (page: number, pageSize: number) => void
	pageOnShowSizeChange?: (current: number, size: number) => void
	current?: number
	pageSize?: number
	pageSizes?: string[]
	total?: number
	rowSelection?: TableProps<any>['rowSelection']
}

const ATTR_KEYS = ['options', 'fieldName']
const getData = (form: FormInstance, index: any) => (form?.getFieldValue && form.getFieldValue(index)) ?? []

type ColumnGroupTypeWithCRender<RecordType> = ColumnGroupType<RecordType> & {
	type: string
	dataIndex: string | number | (string | number)[]
	cRender?: (
		text: any,
		record: RecordType,
		index: number,
		data: any,
		emits: FormListOperation,
		col: ColumnGroupTypeWithCRender<RecordType>
	) => ReactNode
	children?: ColumnGroupTypeWithCRender<RecordType>[]
	$attrs?: any
}
const resolveColumn = (
	fields: any[],
	form: FormInstance,
	emits: any,
	col: ColumnGroupTypeWithCRender<any>,
	formName: string
): ColumnGroupType<any> => {
	const _data = getData(form, [formName])
	const children =
		col?.children?.map((cc) =>
			resolveColumn(fields, form, emits, cc as ColumnGroupTypeWithCRender<any>, formName)
		) ?? []
	let render = col.render
	!col.type &&
		!col.render &&
		(render = (a: any, b: any, c: any) => {
			console.log(a, b, c)
			return a
		})
	if ('cRender' in col && typeof col.cRender === 'function') {
		render = (text: any, record: any, index: number) =>
			col.cRender!(text, record, index, _data?.[record.name], emits, col)
	}
	if ('$attrs' in col && col.$attrs && 'cOnChange' in col.$attrs && typeof col.$attrs.cOnChange === 'function') {
		col.$attrs.onChange = (value: any, restValue: any) => col.$attrs.cOnChange(value, restValue, [formName])
	}
	const ff = {
		...omit(col, 'cRender', '$attrs'),
		render,
		children,
		editable: true,
		onCell: (record: any) => {
			const a = {
				record: fields[record.name],
				label: col.title,
				name: col.dataIndex,
				...pick(col, 'type', '$attrs', 'options', 'formItem$attrs')
			} as any
			console.log('resolveColumn', a)
			return a
		}
	} as ColumnGroupType<any>
	return ff
}

const cellFormItemRender = (f: any, formName: string | string[], form: FormInstance): ReactNode => {
	const _formName = Array.isArray(formName) ? formName : [formName]
	console.log(f)
	const { label, name, record, type, rules, formItem$attrs = [], td$attrs = [], $attrs = {} } = f
	let _children = f.children
	const _hide = !!formItem$attrs?.hidden
	let _hideRule = !!formItem$attrs?.hidden
	!_hideRule && (_hideRule = !!f.hideRule)
	const _data = getData(form, [..._formName])
	const row = _data[record?.name]
	if (f.type) {
		const _type = typeof type === 'function' ? type(row, record.name, formName) : type
		ATTR_KEYS.forEach((k) => k in f && !(k in $attrs) && ($attrs[k] = f[k]))
		const _f = { label, $attrs, style: { width: '100%', maxWidth: '100%' } }
		_children = (
			<AForm.Item name={[record.name, name]} rules={!_hideRule && rules} {...formItem$attrs}>
				{COMPONENTS[_type]?.(_f)}
			</AForm.Item>
		)
	}
	return <td {...td$attrs}>{_hide ? '' : _children}</td>
}

const renderRowKey = (
	record: any,
	form: FormInstance,
	formName: string | string[],
	rowKey: string | ((row: any) => string)
): string => {
	let k = record.name + '_key'
	const _formName = Array.isArray(formName) ? formName : [formName]
	const row = getData(form, [..._formName, record.name])
	if (row) {
		const _k = typeof rowKey === 'function' ? rowKey(row) : row[rowKey] + ''
		!isNil(_k) && _k !== '' && !_k.includes('undefined') && (k = _k)
	}
	return k
}

interface SubEditTableFormProps {
	pname: string
	form: FormInstance
	dataname: string | string[]
	rowKey: string | ((row: any) => string)
}

const SubEditTableForm = ({ pname, form, dataname, rowKey }: SubEditTableFormProps) => {
	return (
		<AForm.List name={[pname, 'children']}>
			{(cfields: any[]) => (
				<ATable
					components={{ body: { cell: (f: any) => cellFormItemRender(f, dataname, form) } }}
					showHeader={false}
					className="edit-form-item-table sub-edit-table"
					dataSource={cfields}
					rowKey={(record: any) => pname + '_' + renderRowKey(record, form, [pname, 'children'], rowKey)}
					pagination={false}
				/>
			)}
		</AForm.List>
	)
}

const EditTableForm = forwardRef<any, EditTableFormProps>(
	(
		{
			form,
			formName,
			columns = [],
			data = [],
			rowKey,
			subRowKey,
			expandeable = false,
			nonPagination = false,
			pageOnChange,
			pageOnShowSizeChange,
			current = 1,
			pageSize = 10,
			pageSizes,
			total = 0,
			rowSelection
		},
		ref
	) => {
		const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])
		const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
		const [selectedRowIndexs, setSelectedRowIndexs] = useState<number[]>([])
		useEffect(() => {
			setExpandedRowKeys([])
			setSelectedRowKeys([])
			setSelectedRowIndexs([])
			form.setFieldsValue({ [formName]: data })
		}, [data, form, formName])
		const emitsRef = useRef<any>({})
		useImperativeHandle(ref, () => ({
			getEmits: () => emitsRef.current,
			getExpandedRowKeys: () => expandedRowKeys,
			getSelectedRowKeys: () => selectedRowKeys,
			getSelectedRowIndexs: () => selectedRowIndexs
		}))
		return (
			<AForm.List name={formName}>
				{(fields: any[], emits: FormListOperation) => {
					emitsRef.current = emits
					return (
						<ATable
							components={{
								body: {
									cell: (f: any) => {
										// console.log('cell', f, formName, form)
										return cellFormItemRender(f, formName, form)
									}
								}
							}}
							columns={columns.map((col) =>
								resolveColumn(fields, form, emits, col as ColumnGroupTypeWithCRender<any>, formName)
							)}
							dataSource={fields}
							rowKey={(record: any) => renderRowKey(record, form, formName, rowKey)}
							expandable={
								// prettier-ignore
								expandeable
									? {
											expandedRowKeys,
											expandedRowRender: (record: any) => (
												<SubEditTableForm
													pname={record.name}
													form={form}
													dataname={[formName, record.name, 'children']}
													rowKey={subRowKey!}
												/>
											),
											rowExpandable: ({ name }: any) => {
												const d = getData(form, [formName, name])
												return !!d?.children?.length
											},
											onExpand: (expanded: boolean, record: any) => {
												const d = getData(form, [formName, record.name])
												setExpandedRowKeys((pr) =>
													expanded
														? [...pr, renderRowKey(d, form, formName, rowKey)]
														: pr.filter(
																(k) => k !== renderRowKey(d, form, formName, rowKey)
														)
												)
											},
											indentSize: 150
									}
									: undefined
							}
							pagination={
								!nonPagination && {
									current,
									pageSize,
									pageSizeOptions: pageSizes || ['10', '20', '30'],
									showSizeChanger: true,
									total: total || fields.length,
									showTotal: (total: number) => `共 ${total} 条`,
									onChange: pageOnChange,
									onShowSizeChange: pageOnShowSizeChange
								}
							}
							rowClassName={() => 'edit-form-item-row'}
							className={'edit-form-item-table' + (nonPagination ? ' non-pagination' : '')}
							rowSelection={
								// prettier-ignore
								!nonPagination
									? {
											selectedRowKeys,
											onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
												setSelectedRowKeys(selectedRowKeys as string[])
												setSelectedRowIndexs(selectedRows.map((r) => r.name))
											},
											...(rowSelection || {})
									}
									: undefined
							}
						/>
					)
				}}
			</AForm.List>
		)
	}
)

export default EditTableForm
