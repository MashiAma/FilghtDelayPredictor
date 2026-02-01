// import React, { useEffect, useState } from 'react'
// import {
//   CCard, CCardBody, CCardTitle, CCol, CRow
// } from '@coreui/react'
// import { Line, Pie } from 'react-chartjs-2'
// import {
//   Chart as ChartJS, CategoryScale, LinearScale, PointElement,
//   LineElement, ArcElement, Tooltip, Legend
// } from 'chart.js'
// import { toast } from 'react-toastify'
// import {
//   generateDailySale,
//   getCustomerCount,
//   getDailySalesByMonth,
//   getTotalQuantityByCategory
// } from '../services/authService'
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend)

// const Dashboard = () => {
//   const [todaySummary, setTodaySummary] = useState({})
//   const [todayDate, setTodayDate] = useState('')
//   const [customerCount, setCustomerCount] = useState('')
//   const [monthlySalesData, setMonthlySalesData] = useState([])
//   const [monthlyItemData, setMonthlyItemData] = useState([])

//   const currentMonth = new Date().getMonth() + 1
//   const currentYear = new Date().getFullYear()

//   useEffect(() => {
//     const today = new Date().toISOString().split('T')[0]
//     setTodayDate(today)
//   }, [])

//   useEffect(() => {
//     if (!todayDate) return

//     const fetchSales = async () => {
//       try {
//         const response = await generateDailySale(todayDate)
//         setTodaySummary(response.data || {})
//       } catch (error) {
//         toast.error('Failed to fetch sales data')
//       }
//     }

//     fetchSales()
//   }, [todayDate])

//   useEffect(() => {
//     const fetchCount = async () => {
//       try {
//         const response = await getCustomerCount()
//         setCustomerCount(response.data || 0)
//       } catch (error) {
//         toast.error('Failed to fetch customer count')
//       }
//     }

//     fetchCount()
//   }, [])

//   useEffect(() => {
//     const fetchMonthlySales = async () => {
//       try {
//         const response = await getDailySalesByMonth(currentYear, currentMonth)
//         // Expecting: [{ day: 1, total: 2000 }, { day: 2, total: 3500 }, ...]
//         setMonthlySalesData(response.data || [])
//       } catch (error) {
//         toast.error('Failed to fetch monthly sales')
//       }
//     }

//     fetchMonthlySales()
//   }, [currentMonth, currentYear])

//   useEffect(() => {
//     const fetchMonthlyItems = async () => {
//       try {
//         const response = await getTotalQuantityByCategory(currentYear, currentMonth)
//         // Expecting: [{ itemCategory: 'Book', totalQuantity: 20 }, { itemCategory: 'Pen', totalQuantity: 10 }]
//         setMonthlyItemData(response.data || [])
//       } catch (error) {
//         toast.error('Failed to fetch item count')
//       }
//     }

//     fetchMonthlyItems()
//   }, [currentMonth, currentYear])

//   // Line chart data
//   const lineChartData = {
//   labels: monthlySalesData.map(d => {
//     const date = new Date(d.date);
//     return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
//       .toString()
//       .padStart(2, '0')}`;
//   }),
//   datasets: [
//     {
//       label: 'Sales (LKR)',
//       data: monthlySalesData.map(d => d.totalSales),
//       fill: true,
//       borderColor: "#02187dff",
//       backgroundColor:'#6bb0e8ff',
//       tension: 0,
//     },
//   ],
// }
//   // Pie chart data
//   const pieChartData = {
//     labels: monthlyItemData.map(item => item.itemCategory),
//     datasets: [
//       {
//         label: 'Items Sold',
//         data: monthlyItemData.map(item => item.totalQuantity),
//         backgroundColor: ["#02187dff", '#1c4cc5ff', '#2e94b1ff', '#62e6f7ff'],
//         hoverOffset: 8,
//       },
//     ],
//   }

//   return (
//     <div className="p-0" style={{overflow:"hidden"}}>
//       <CRow className="mb-4" >
//         <CCol xs={12} sm={6} lg={4} >
//           <CCard className="text-center shadow-sm" style={{ height: '130px' }}>
//             <CCardBody>
//               <CCardTitle style={{fontWeight:"bold", fontSize:"22px", marginBottom:"20px"}}>Total Sales - {todayDate}</CCardTitle>
//               <h1 style={{color:"#02187dff"}}>LKR {todaySummary.totalSales?.toFixed(2) || '0.00'}</h1>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol xs={12} sm={6} lg={4}  >
//           <CCard className="text-center shadow-sm"style={{ height: '130px' }}>
//             <CCardBody>
//               <CCardTitle style={{fontWeight:"bold", fontSize:"22px", marginBottom:"20px"}}>Transactions - {todayDate}</CCardTitle>
//               <h1 style={{color:"#02187dff"}}>{todaySummary.totalTransactions || 0}</h1>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol xs={12} sm={6} lg={4}>
//           <CCard className="text-center shadow-sm"style={{ height: '130px' }}>
//             <CCardBody>
//               <CCardTitle style={{fontWeight:"bold", fontSize:"22px", marginBottom:"20px"}}>Total Customers</CCardTitle>
//               <h1 style={{color:"#02187dff"}}>{customerCount}</h1>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>

//       <CRow className="mb-3">
//         <CCol lg={8} className="mb-3 mb-lg-0">
//           <CCard className="shadow-sm h-90">
//             <CCardBody>
//               <CCardTitle className="mb-3" style={{fontWeight:"bold", fontSize:"24px", textAlign:"center"}}>Sales Trend - {currentYear}/{currentMonth}</CCardTitle>
//               <div style={{ height: '207px' }}>
//                 <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
//               </div>
//             </CCardBody>
//           </CCard>
//         </CCol>
//         <CCol lg={4}>
//           <CCard className="shadow-sm h-90">
//             <CCardBody>
//               <CCardTitle className="mb-3" style={{fontWeight:"bold", fontSize:"22px",textAlign:"center"}}>Top Selling Items- {currentYear}/{currentMonth}</CCardTitle>
//               <div style={{ height: '210px' }}>
//                 <Pie data={pieChartData} options={{ maintainAspectRatio: false, responsive: true }} />
//               </div>
//             </CCardBody>
//           </CCard>
//         </CCol>
//       </CRow>
//     </div>
//   )
// }

// export default Dashboard
