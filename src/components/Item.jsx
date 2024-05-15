import { MdDelete } from 'react-icons/md';
function Item({ task }) {
	return (
		<div className='flex justify-center bg-slate-700 p-3 rounded-lg gap-10'>
			<span>{task}</span>
			<MdDelete />
		</div>
	);
}
export default Item;
