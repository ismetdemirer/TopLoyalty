import styled from 'styled-components'

export const ReportsGrid = styled.div`
  display: grid;
  gap: 16px;
`

export const FilterCard = styled.div`
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  background: #ffffff;
  padding: 20px;
  display: grid;
  gap: 14px;
`

export const FilterTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  font-family: 'DM Sans', sans-serif;
`

export const FilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

export const FilterActions = styled.div`
  align-self: end;
`

export const ReportTableCard = styled.div`
  border: 1.5px solid #E2E8F0;
  border-radius: 20px;
  background: #ffffff;
  padding: 12px;
  min-height: 120px;
`

export const TableScrollWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`

export const ReportTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 580px;
`

export const ReportTh = styled.th`
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

export const ReportTr = styled.tr`
  border-top: 1px solid #F1F5F9;
  transition: background 0.15s;

  &:hover {
    background: rgba(15, 118, 110, 0.02);
  }
`

export const ReportTd = styled.td<{ $bold?: boolean; $muted?: boolean }>`
  padding: 14px 10px;
  color: ${({ $bold, $muted }) => ($bold ? '#0F172A' : $muted ? '#94A3B8' : '#334155')};
  font-weight: ${({ $bold }) => ($bold ? 600 : 400)};
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  white-space: nowrap;
`

export const ReportEmptyTd = styled.td`
  padding: 32px 10px;
  color: #64748B;
  text-align: center;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
`
