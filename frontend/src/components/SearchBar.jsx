import React, { useState } from 'react'
import { CInputGroup, CFormInput, CButton } from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilSearch, cilXCircle } from '@coreui/icons'

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    if (onSearch) onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    if (onSearch) onSearch('')
  }

  return (
    <CInputGroup className="mb-3 shadow-sm" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <CFormInput
        type="text"
        placeholder="Search here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        style={{ borderTopLeftRadius: '25px', borderBottomLeftRadius: '25px' }}
      />
      {query && (
        <CButton
          type="button"
          color="light"
          onClick={handleClear}
          style={{ borderRadius: '0' }}
        >
          <CIcon icon={cilXCircle} />
        </CButton>
      )}
      <CButton
        type="button"
        color="primary"
        onClick={handleSearch}
        style={{
          borderTopRightRadius: '25px',
          borderBottomRightRadius: '25px',
        }}
      >
        <CIcon icon={cilSearch} />
      </CButton>
    </CInputGroup>
  )
}

export default SearchBar
