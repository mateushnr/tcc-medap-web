import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  ContainerPageItem,
  ContainerPagination,
  IntervalDetail,
  NextPageButton,
  PageItemButton,
  PreviousPageButton,
} from './styles'

interface PaginationProps {
  totalCount: number
  currentPage: number
  handleUpdatePageData: (page: number) => Promise<void>
}

export default function Pagination({
  handleUpdatePageData,
  totalCount,
  currentPage,
}: PaginationProps) {
  const pageSize = 6

  const totalPages = Math.ceil(totalCount / pageSize)

  const getPages = () => {
    const pages = []
    const maxPagesToShow = 5

    pages.push(1)

    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(2, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <ContainerPagination>
      <PreviousPageButton
        onClick={() => {
          handleUpdatePageData(currentPage - 1)
        }}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={18} />
      </PreviousPageButton>

      {getPages().map((page, index) => (
        <ContainerPageItem key={page}>
          {' '}
          {index === 1 && page !== 2 ? (
            <IntervalDetail>...</IntervalDetail>
          ) : null}
          <PageItemButton
            isCurrentPage={currentPage === page}
            onClick={() => {
              handleUpdatePageData(page)
            }}
          >
            {page}
          </PageItemButton>
          {index === totalPages - 3 &&
          page !== totalPages - 1 &&
          totalPages > 5 ? (
            <IntervalDetail>...</IntervalDetail>
          ) : null}
        </ContainerPageItem>
      ))}
      <NextPageButton
        onClick={() => {
          handleUpdatePageData(currentPage + 1)
        }}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={18} />
      </NextPageButton>
    </ContainerPagination>
  )
}
