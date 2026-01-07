import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormSwitch,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CRow,
  CCol,
  CContainer
} from '@coreui/react'
import { toast } from 'react-toastify';
import ItemWindow from '../components/ItemWindow';
import { getAllUsers, getUser, updateUser, updateUserStatus } from '../services/authService'

const ViewUser = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [visibleDialog, setVisibleDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])

  const rowsPerPage = 5

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers()
        setUsers(response.data)
      } catch (error) {
        toast.error('Failed to fetch users')
      }
    }

    fetchUsers()
  }, [])

  const handleView = (item) => {
    setSelectedItem(item)
    setVisibleDialog(true)
  }

  const handleSave = async (updatedItem) => {
    try {
      await updateItem(updatedItem)

      const updatedList = items.map((item) =>
        item.itemId === updatedItem.itemId ? updatedItem : item,
      )
      setItems(updatedList)
      setVisibleDialog(false)
      toast.success('Item updated successfully')
    } catch (error) {
      console.error('Failed to update item:', error)
      toast.error('Failed to update item')
    }
  }
  const handleToggleStatus = async (user) => {
    const updatedStatus = !user.isEnabled
    try {
      await updateUserStatus({ email: user.email, isEnabled: updatedStatus })
      const updatedUsers = users.map((u) =>
        u.email === user.email ? { ...u, isEnabled: updatedStatus } : u,
      )
      setUsers(updatedUsers)
      toast.success(`User ${updatedStatus ? 'enabled' : 'disabled'} successfully`)
    } catch (error) {
      toast.error('Failed to update user status')
    }
  }

  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase()
    return (
      user.full_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  })

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  )

  return (
    <CContainer className="mt-0">
      <CCard style={{ minHeight: '445px' }}>
        <CCardHeader style={{ backgroundColor: "#02187dff" }}>
          <CRow>
            <CCol xs={12} md={6}>
              <h5 style={{ color: "#f5f6faff", fontWeight: "bolder", marginTop: "5px" }}>User List</h5>
            </CCol>
            <CCol xs={12} md={6}>
              <CFormInput
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                style={{ maxWidth: '100%', float: 'right' }}
              />
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CTable striped responsive hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Full Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Role</CTableHeaderCell>
                <CTableHeaderCell>Phone Number</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Toggle</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{user.fullName}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.role}</CTableDataCell>
                    <CTableDataCell >
                      {user.isEnabled ? 'Enabled' : 'Disabled'}
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormSwitch
                        style={{ backgroundColor: user.isEnabled ? "#02187dff" : '#cdcdcdff' }}
                        checked={user.isEnabled}
                        onChange={() => handleToggleStatus(user)}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        style={{ backgroundColor: "#02187dff", fontWeight: "bold", color: "white" }}
                        size="sm"
                        className="me-2"
                        onClick={() => handleView(item)}
                      >
                        View
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan="5" className="text-center">
                    No matching users found.
                  </CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>

          <CPagination align="center" className="mt-3">
            <CPaginationItem
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              &laquo;
            </CPaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <CPaginationItem
                key={index}
                active={currentPage === index + 1}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </CPaginationItem>
            ))}
            <CPaginationItem
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              &raquo;
            </CPaginationItem>
          </CPagination>
        </CCardBody>

        {visibleDialog && selectedItem && (
          <ItemWindow
            visible={visibleDialog}
            item={selectedItem}
            onClose={() => setVisibleDialog(false)}
            onSave={handleSave}
          />
        )}
      </CCard>
    </CContainer>
  )
}

export default ViewUser
