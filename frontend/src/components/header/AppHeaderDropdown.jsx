import React, { useContext, useState } from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilEnvelopeOpen,
  cilLockLocked,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import userImage from '../../assets/user.png';
import { AuthContext } from '../../context/AuthContext';
import VerifyPasswordDialog from '../../pages/Users/VerifyPasswordDialog';
import SetNewPasswordDialog from '../../pages/Users/SetNewPasswordDialog';
import { useNavigate } from 'react-router-dom';

const AppHeaderDropdown = () => {
  const { user, logout } = useContext(AuthContext);
  // const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const navigate = useNavigate();
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
          <CAvatar src={userImage} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-body-secondary fw-semibold mb-1">
            Account
          </CDropdownHeader>
          <CDropdownItem>
            <div style={{ fontSize: '16px', fontWeight: "bold" }}>{user.fullName ? `${user.fullName}` : "Not Logged In"}</div>
            <div style={{ fontSize: '14px' }}>{user.email ? `${user.email} (${user.role})` : ""}</div>
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem

            onClick={() => { navigate('/register') }}
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            Register
          </CDropdownItem>
          <CDropdownItem
            onClick={() => { navigate('/login') }}
            style={{ cursor: 'pointer' }}
          >
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            Login
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem onClick={() => setVerifyOpen(true)}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Change Passsword
          </CDropdownItem>
          <CDropdownItem onClick={handleLogout}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Logout
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>

      {/* Password Change Dialog */}
      {/* {showPasswordDialog && (
        <VerifyPasswordDialog
          open={showPasswordDialog}
          onClose={() => setShowPasswordDialog(false)}
        />
      )} */}
      <VerifyPasswordDialog
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        onVerified={() => {
          setVerifyOpen(false);
          setChangeOpen(true);
        }}
      />

      {/* Set new password dialog */}
      <SetNewPasswordDialog
        open={changeOpen}
        onClose={() => setChangeOpen(false)}
      />
    </>
  );
};

export default AppHeaderDropdown;
