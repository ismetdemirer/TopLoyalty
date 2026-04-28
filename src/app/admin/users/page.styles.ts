import styled from 'styled-components'

export const UsersGrid = styled.div`
  display: grid;
  gap: 16px;
`

export const AddUserCard = styled.div`
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  background: #ffffff;
  padding: 20px;
  display: grid;
  gap: 14px;
`

export const AddUserTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  font-family: 'DM Sans', sans-serif;
`

export const AddUserForm = styled.form``

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: end;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const UserTableCard = styled.div`
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  background: #ffffff;
  padding: 12px;
`

export const TableScrollWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`

export const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 500px;
`

export const UserTh = styled.th`
  text-align: left;
  padding: 12px 10px;
  color: #0F766E;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
`

export const UserTr = styled.tr`
  border-top: 1px solid #F1F5F9;
  transition: background 0.15s;

  &:hover {
    background: rgba(15, 118, 110, 0.02);
  }
`

export const UserTd = styled.td<{ $bold?: boolean }>`
  padding: 14px 10px;
  color: ${({ $bold }) => ($bold ? '#0F172A' : '#334155')};
  font-weight: ${({ $bold }) => ($bold ? 600 : 400)};
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
`

export const UserEmptyTd = styled.td`
  padding: 32px 10px;
  color: #64748B;
  text-align: center;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
`

export const RoleBadge = styled.span<{ $role: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ $role }) =>
    $role === 'ADMIN' ? 'rgba(15, 118, 110, 0.10)' : 'rgba(245, 158, 11, 0.10)'};
  color: ${({ $role }) => ($role === 'ADMIN' ? '#0F766E' : '#F59E0B')};
`
