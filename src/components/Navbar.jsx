import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

// import { MdDelete } from 'react-icons/md';
import { v4 as uuid } from 'uuid';
import heartgif from '../images/heartgif.svg';
import workout from '../images/workout.svg';
import circles from '../images/circles.svg';
import arrow from '../images/arrow.svg';
import Chart from 'chart.js/auto';
import first from '../images/first.svg';
import second from '../images/second.svg';
import third from '../images/third.svg';
import fourth from '../images/fourth.svg';

const Navbar = () => {
	const [checked, setChecked] = useState(null);
	const [task, setTask] = useState('');
	const [items, setItems] = useState([]);
	const chartRef = useRef(null);

	useEffect(() => {
		const checkedElements = items.filter(
			(element) => element.completed === true,
		);
		setChecked(checkedElements.length);
	}, [items]);

	useEffect(() => {
		const renderItems = JSON.parse(localStorage.getItem('items'));
		if (!renderItems) {
			const defaultTasks = [
				{ task: 'Complete homework', completed: true, id: uuid() },
				{ task: 'Go for a run', completed: true, id: uuid() },
				{ task: 'Read a book', completed: true, id: uuid() },
				{ task: 'Drink 3L water', completed: true, id: uuid() },
			];
			setItems(defaultTasks);
			localStorage.setItem('items', JSON.stringify(defaultTasks));
			setTask('');
			return;
		}
		setItems(renderItems);
	}, []);

	const handleCheck = (check_id) => {
		const checkedItems = items.map((item) =>
			item.id === check_id ? { ...item, completed: !item.completed } : item,
		);
		setItems(checkedItems);
		localStorage.setItem('items', JSON.stringify(checkedItems));
	};

	const handleChange = () => {
		const small_id = uuid().slice(0, 8);
		if (!task) {
			alert('Enter Task');
			return;
		}

		const newItem = { task, completed: false, id: small_id };
		localStorage.setItem('items', JSON.stringify([...items, newItem]));
		setItems([...items, newItem]);
		setTask('');
	};

	useEffect(() => {
		if (chartRef.current) {
			chartRef.current.destroy();
		}

		const ctx = document.getElementById('myChart').getContext('2d');
		const completed = checked ? (checked / items.length) * 100 : 0;
		const remaining = 100 - completed;

		const newChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['Completed', 'Remaining'],
				datasets: [
					{
						label: 'Goal Progress',
						data: [completed, remaining],
						backgroundColor: ['#69a4df', 'red'],
						borderWidth: 0,
					},
				],
			},
			options: {
				indexAxis: 'x',
				scales: {
					x: {
						beginAtZero: true,
						stacked: true,
					},
					y: {
						stacked: true,
					},
				},
			},
		});

		// Set the chart instance to the ref
		chartRef.current = newChart;
	}, [checked, items]);

	return (
		<div className='flex flex-col bg-[#1d1d1d] p-0 gap-6'>
			<div className='bg-[#69a4df] text-white p-1 rounded-2xl mt-8 ml-5 mr-5 flex items-center'>
				<img
					src={circles}
					alt='circles'
					className='w-20 h-28 mr-4'
				/>
				<div>
					<h2 className='text-lg font-semibold'>Your Daily Goal Almost Done</h2>
					<p className='text-sm'>
						{checked
							? `${checked} of ${items.length} Completed`
							: '0 of 0 Completed'}
					</p>
					<div className='relative w-full mt-2 bg-white h-2.5 rounded-full'>
						<div
							className='absolute top-0 left-0 bg-[#0b121a] h-full rounded-full'
							style={{ width: `${(checked / items.length) * 100}%` }}
						/>
					</div>
					<div className='text-right text-sm font-semibold mt-1'>
						{checked ? `${(checked / items.length) * 100}%` : '0%'}
					</div>
				</div>
			</div>
			<div className='flex-1 overflow-y-auto p-4 bg-[#1d1d1d]'>
				<h3 className='text-lg font-semibold text-white mb-4 flex justify-between m-2 '>
					Today's Goal{' '}
					<img
						src={heartgif}
						alt='gif'
					/>
				</h3>

				<div className='space-y-4'>
					{items.length > 0 ? (
						items.map((element) => (
							<div
								key={element.id}
								className={`flex items-center justify-between bg-zinc-700 p-4 rounded-xl ${
									element.completed && ' text-red-50'
								}`}>
								<div className='text-purple-600 text-2xl'>
									<img
										src={workout}
										alt='workout'
										className='size-8 ml-3 mr-5'
									/>
								</div>
								<span className='text-white ml-2 flex-1'>{element.task}</span>
								<input
									type='checkbox'
									className=' form-checkbox h-6 w-6 text-green-500 rounded-sm border-gray-300 focus:ring-green-500 '
									checked={element.completed}
									onChange={() => handleCheck(element.id)}
								/>
							</div>
						))
					) : (
						<div>No Tasks</div>
					)}
				</div>
				<div className='flex justify-end mt-6'>
					<input
						style={{ outline: 'none' }}
						value={task}
						onChange={(e) => setTask(e.target.value)}
						className='w-4/5 p-3 border-gray-50 rounded-2xl bg-slate-500'
						type='text'
						placeholder='Enter Goal'
					/>
					<button
						onClick={handleChange}
						className='w-1/5 ml-2 p-3 border-gray-50 rounded-xl bg-zinc-700 text-white'>
						Add
					</button>
				</div>
				<br />
				<div className='flex  justify-around bg-orange-500 p-4 rounded-full'>
					<button className='border-2 border-slate-100 bg-white w-10 h-10 rounded-full text-sm  '>
						Track
					</button>
					<button className='  rounded-full text-sm  '>
						Swipe to track all
					</button>
					<button className='  rounded-full text-sm  '>
						<img
							src={arrow}
							alt='arrows'
						/>
					</button>
				</div>
				<div className='w-full h-[300px] mt-6'>
					<canvas
						id='myChart'
						width='400'
						height='200'></canvas>
				</div>
			</div>
			<div className='bg-[#323232] p-4 flex justify-around'>
				<div className='text-white text-2xl'>
					<Link to='/page1'>
						<img
							src={first}
							alt='page1'
						/>{' '}
					</Link>
				</div>
				<div className='text-white text-2xl'>
					<Link to='/page2'>
						<img
							src={second}
							alt='page2'
						/>
					</Link>
				</div>
				<div className='text-white text-2xl'>
					<Link to='/page3'>
						<img
							src={third}
							alt='page3'
						/>
					</Link>
				</div>
				<div className='text-white text-2xl'>
					<Link to='/page4'>
						<img
							src={fourth}
							alt='page4'
						/>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
