import React from 'react'
import { useState, useContext } from 'react'
import {
  CContainer,
  CCard,
  CCardBody,
  CCardHeader,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CFormInput,
  CButton,
  CRow,
  CCol,
  CFormText
} from '@coreui/react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilSettings,
  cilCart,
  cilLockLocked,
  cilUserPlus,
  cilPeople,
  cilUser,
  cilList

} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { AuthContext } from '../context/AuthContext'

const Help = () => {
  const { user } = useContext(AuthContext);
  const [activeKey, setActiveKey] = useState(null);

  return (
    <CContainer className="mt-0 mb-0">
      <CCard className="shadow-lg border-0" style={{ height: '445px' }}>
        <CCardHeader className="text-white text-center fs-4" style={{ backgroundColor: "#02187dff", fontWeight: "bold" }}>
          User Help Guide
        </CCardHeader>
        <CCardBody style={{ overflowY: 'auto' }}>

          <CAccordion alwaysOpen>
            <CAccordionItem itemKey={1}>
              <CAccordionHeader className="custom-accordion-header"><strong><CIcon icon={cilLockLocked} style={{ height: "20px", width: "30px", color: "#0b5394", marginRight: "8px" }} /> How to Log In?</strong></CAccordionHeader>
              <CAccordionBody>
                <ul>
                  <li>Visit the login page Click <a href="http://localhost:5173/login" style={{ color: "#02187dff" }}>Login</a></li>
                  <li>Enter your registered <strong>email</strong> and <strong>password</strong>.</li>
                  <li>Click the <strong>Log In</strong> button to proceed.</li>
                  <li>If your credentials are correct, you will be redirected to the <strong>Bill Generator</strong> page.</li>
                </ul>
              </CAccordionBody>
            </CAccordionItem>
            <CAccordionItem itemKey={2}>
              <CAccordionHeader>
                <strong>
                  <CIcon
                    icon={cilUser}
                    style={{ height: '20px', width: '30px', color: '#0b5394', marginRight: '8px' }}
                  />
                  Reset Password
                </strong>
              </CAccordionHeader>
              <CAccordionBody>
                <ul>
                  <li>On the login page, Click <strong>Forgot Password?</strong>.</li>
                  <li>Enter your registered email address and New password.</li>
                  <li>Click <strong>Reset Password</strong> to reset your password.</li>
                </ul>
              </CAccordionBody>
            </CAccordionItem>
            <CAccordionItem itemKey={3}>
              <CAccordionHeader style={{ fontWeight: 'bold' }}>
                <strong><CIcon icon={cilCart} style={{ height: "20px", width: "30px", color: "#0b5394", marginRight: "8px" }} />
                  How to Generate a Bill?</strong>
              </CAccordionHeader>
              <CAccordionBody>
                <ul>
                  <li>Go to the <strong>Bill Generator</strong> section in the sidebar.</li>
                  <li>In the customer search bar, enter the customer’s phone number to quickly find customer, then select the relevant customer from the displayed list.</li>
                  <li>If the customer is not found, Click the <strong>+ New Customer</strong> button to create a new customer account. This will direct you to the <strong>Create Customer Account</strong> page. Then, <strong> Create New Customer Account</strong>  and navigate to <strong>Bill Generator</strong> Page.</li>
                  <li>If customer is available, In the <strong>Item Name</strong> section, search for an item by its name and select the correct item from the displayed list along with its price.</li>
                  <li>Enter the <strong>Quantity</strong> of the item. If an item discount is available, add the discount percentage. The discount will be calculated automatically, and both the total value and discount amount will be displayed.</li>
                  <li>Use the <strong>Bin</strong> Icon in each row to remove any mistakenly added items.</li>
                  <li>Click the <strong>+</strong> icon at the bottom to insert additional rows into the bill.</li>
                  <li>In the <strong>Cash Received</strong> field, enter the amount received from the customer. The balance amount will be calculated automatically and displayed in the <strong>Change</strong> section.</li>
                  <li>Click <strong>Save &amp; Print Bill</strong> to finalize and print the bill.</li>
                  <li>Click <strong>Clear</strong> to reset and clear all sections of the bill if needed.</li>
                </ul>
              </CAccordionBody>
            </CAccordionItem>
            <CAccordionItem itemKey={4}>
              <CAccordionHeader>
                <strong>
                  <CIcon
                    icon={cilUser}
                    style={{ height: '20px', width: '30px', color: '#0b5394', marginRight: '8px' }}
                  />
                  Customer Handling
                </strong>
              </CAccordionHeader>
              <CAccordionBody>
                <CFormText><strong>Add New Customers</strong></CFormText>
                <ul>
                  <li>Navigate to the <strong>Customer</strong> section.</li>
                  <li>Click <strong>+ Create Account</strong> and fill in all the required customer details.</li>
                  <li>Once completed, click the <strong>Create</strong> button to proceed.</li>
                  <li>A verification code will be automatically sent to the customer’s registered email address.</li>
                  <li>The <strong>Verification Code</strong> window will appear. Enter the code received by the customer into the provided field.</li>
                  <li>After entering the correct code, click <strong>Verify</strong>. The new customer account will now be created and verified successfully.</li>
                </ul>
                <br />
                <CFormText><strong>View/Edit Existing Customers</strong></CFormText>
                <ul>
                  <li>Navigate to the <strong>Customer</strong> section. Then, Click <strong>View/Modify</strong> to see the list of all registered customers in the system.</li>
                  <li>Use the search option to quickly find specific customer.</li>
                  <li>Select a customer and Click <strong>View</strong> button to view all customer details of that specific customer.</li>
                  <li>Then, Click <strong>Pencil Icon</strong> to Edit Customer details.</li>
                  <li>Then, Click <strong>Save</strong> to add new Customer details to the system.</li></ul>
              </CAccordionBody>
            </CAccordionItem>
            <CAccordionItem itemKey={5}>
              <CAccordionHeader>
                <strong>
                  <CIcon
                    icon={cilList}
                    style={{ height: '20px', width: '30px', color: '#0b5394', marginRight: '8px' }}
                  />
                  Item Handling
                </strong>
              </CAccordionHeader>
              <CAccordionBody>
                <CFormText><strong>Add New Items</strong></CFormText>
                <ul>
                  <li>Navigate to the <strong>Items</strong> section.</li>
                  <li>Then, Click <strong>+ New Items</strong> and fill the item details. Then, Click <strong>Add</strong> Button to Add New Items.</li>
                </ul>
                <br />
                <CFormText><strong>Edit Existing Items and Add New Prices</strong></CFormText>
                <ul>
                  <li>Navigate to the <strong>Items</strong> section. Then, Click <strong>View/Modify</strong> to see the list of all current items in the system.</li>
                  <li>Use the search option to quickly find specific item.</li>
                  <li>Select a item and Click <strong>View</strong> button to view all item details of that specific item.</li>
                  <li>Then, Click <strong>Pencil Icon</strong> to Edit Item details.</li>
                  <li>Then, Click <strong>Save</strong> to add new Item details to the system.</li>
                  <li>If you want to add new prices, Enter a <strong>New Price</strong> on <strong>Add New Price</strong> input box and Click <strong>Add</strong> to save new price to the system.</li>
                </ul>
                <br />
                <CFormText><strong>Delete Existing Item</strong></CFormText>
                <ul>
                  <li>Navigate to the <strong>Items</strong> section. Then, Click <strong>View/Modify</strong> to see the list of all current items in the system.</li>
                  <li>Use the search option to quickly find specific item.</li>
                  <li>Select a item and Click <strong>Delete</strong> button to delete specific item.</li>
                </ul>
              </CAccordionBody>
            </CAccordionItem>
            {user.role === 'admin' && (
              <CAccordionItem itemKey={6}>
                <CAccordionHeader>
                  <strong>
                    <CIcon
                      icon={cilDescription}
                      style={{ height: '20px', width: '30px', color: '#0b5394', marginRight: '8px' }}
                    />
                    Report Handling
                  </strong>
                </CAccordionHeader>
                <CAccordionBody>
                  <ul>
                    <li>Navigate to the <strong>Reports</strong> section.</li>
                    <li>Select the report type you want to generate or view.(Customer or Sales)</li>
                    <li>Use filters to specify date ranges or report criteria.</li>
                    <li>Click <strong>Print Report</strong> to print the report.</li>
                    <li>Download or print the report using the available options.</li>
                  </ul>
                </CAccordionBody>
              </CAccordionItem>
            )}
            {user.role === 'admin' && (
              <CAccordionItem itemKey={7}>
                <CAccordionHeader> <strong><CIcon icon={cilUserPlus} style={{ height: "20px", width: "30px", color: "#0b5394", marginRight: "8px" }} /> User Handling </strong></CAccordionHeader>
                <CAccordionBody>
                  <CFormText><strong>How to Register a New User?</strong></CFormText>
                  <ul>
                    <li>Navigate to the <strong>Users</strong> section.</li>
                    <li>Then Click <strong>+ New User</strong>.</li>
                    <li>Enter the following details:
                      <ul>
                        <li><strong>Full Name</strong></li>
                        <li><strong>Email</strong> (must be unique)</li>
                        <li><strong>Password</strong></li>
                        <li><strong>Role</strong> – either <em>admin</em> or <em>cashier</em></li>
                      </ul>
                    </li>
                    <li>Click <strong>Create</strong> to create a user account.</li>
                  </ul>
                  <br />
                  <CFormText><strong>View Current Users & Handle Users</strong></CFormText>

                  <ul>
                    <li>Navigate to the <strong>Users</strong> section. Then, Click <strong>View/Modify</strong> to see the list of all current users in the system.</li>
                    <li>Use the search option to quickly find specific users.</li>
                    <li>Identify inactive/active users by their status shown in the list.</li>
                    <li>Select a user and use the <strong>Toggle</strong> option to enable or disable their access to the system.</li>
                  </ul>
                </CAccordionBody>
              </CAccordionItem>
            )}
            {/* Change Password Section */}
            <CAccordionItem itemKey={8}>
              <CAccordionHeader>
                <strong>
                  <CIcon
                    icon={cilLockLocked}
                    style={{ height: '20px', width: '30px', color: '#0b5394', marginRight: '8px' }}
                  />
                  Change Password
                </strong>
              </CAccordionHeader>
              <CAccordionBody>
                <ul>
                  <li>Click on <strong>Account Icon</strong> section.</li>
                  <li>Click on <strong>Change Password</strong>.</li>
                  <li>Enter your New password, then the enter new password again to confirm.</li>
                  <li>Click <strong>Change</strong> to update your password.</li>
                </ul>
              </CAccordionBody>
            </CAccordionItem>
            <CAccordionItem itemKey={9}>
              <CAccordionHeader>
                <strong>
                  <CIcon icon={cilSettings} style={{ height: 20, width: 30, color: "#0b5394", marginRight: 8 }} />
                  System Requirements</strong>
              </CAccordionHeader>
              <CAccordionBody>
                <ul>
                  <li>Use a Modern browser (Chrome, Firefox, Edge) (latest versions recommended)</li>
                  <li>Stable internet connection</li>
                  <li>Screen resolution: 1280x720 or higher for best experience</li>
                </ul>
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>

          <div className="text-center mt-5">
            <p className="text-muted mb-2">
              Still need help? Our support team is here for you.
            </p>

            <CFormText color="info" className="me-2 d-block">
              📞 Contact Support: <strong>+94 77 123 4567</strong> | <strong>+94 11 234 5678</strong>
            </CFormText>

            <CFormText color="info" className="me-2 d-block">
              📧 Email: <a href="mailto:support@yourcompany.com">support@mashiama.com</a>
            </CFormText>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  )
}

export default Help
