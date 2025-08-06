import Select_Oxr from './Select_Oxr'
const COMPONENTS = {
	Select: (f: any) => <Select_Oxr {...f.$attrs} />,
	Input: (f: any) => <AInput {...f.$attrs} />
} as Record<string, (f: any) => JSX.Element>
export default COMPONENTS
