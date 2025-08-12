import { EditFormItem, EditFormTable } from '@/components/form-module'
import { useTable } from '@/hooks'
import './index.scoped.scss'
const HomeApp = () => {
	const [form] = AForm.useForm()

	const forms = [
		{
			name: 'name',
			label: '姓名',
			type: 'Input',
			rules: [{ required: true, message: '请输入姓名' }]
		},
		{
			name: 'sex',
			label: '性别',
			type: 'Select',
			rules: [{ required: true, message: '请选择性别' }],
			options: [
				{
					label: '男',
					value: '1'
				},
				{
					label: '女',
					value: '2'
				}
			]
		}
	]
	const tableForms = [
		{
			title: '姓名',
			dataIndex: 'uname',
			type: 'Input'
		},
		{
			title: '性别',
			dataIndex: 'sex',
			type: 'Select',
			options: [
				{
					label: '男',
					value: '1'
				},
				{
					label: '女',
					value: '2'
				}
			]
		}
	]
	const tableRef = useRef<any>(null)
	const x = useTable(tableForms, [], {
		prefix: 'search'
	})
	console.log('useTable', x)
	return (
		<div className="form-module-box">
			<AButton
				onClick={() => {
					console.log(form.getFieldsValue())
				}}
			>
				X
			</AButton>
			<AForm form={form} requiredMark>
				<div>
					<EditFormItem forms={forms} form={form} />
				</div>
				<div>
					<EditFormTable
						ref={tableRef}
						form={form}
						formName="editTable"
						rowKey={'uname'}
						columns={tableForms}
						data={[
							{
								key: '1',
								uname: '张三',
								age: 18,
								sex: '1'
							}
						]}
					/>
				</div>
			</AForm>
		</div>
	)
}

export default HomeApp
