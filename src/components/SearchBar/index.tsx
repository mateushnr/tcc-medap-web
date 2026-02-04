import { Search, X } from 'lucide-react'
import {
  ClearButton,
  ContainerSearchBar,
  InputSearchBar,
  SearchButton,
} from './styles'
import {
  forwardRef,
  useState,
  type ComponentProps,
  type ElementRef,
} from 'react'

interface SearchBarProps extends ComponentProps<typeof InputSearchBar> {
  handleSearch?: (searchTerm: string) => Promise<void>
  handleClear?: () => Promise<void>
}

export const SearchBar = forwardRef<
  ElementRef<typeof InputSearchBar>,
  SearchBarProps
>(({ handleSearch, handleClear, ...props }: SearchBarProps, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [searchInputValue, setSearchInputValue] = useState('')

  function handleFocus() {
    setIsFocused(true)
  }

  const handleSearchClick = () => {
    if (searchInputValue) {
      if (handleSearch) {
        handleSearch(searchInputValue)
      }
    }
  }

  const handleClearClick = () => {
    if (handleClear) {
      handleClear()
      setSearchInputValue('')
    }
  }

  return (
    <ContainerSearchBar
      onFocus={handleFocus}
      onBlur={() => setIsFocused(false)}
      isFocused={isFocused}
    >
      <SearchButton onClick={handleSearchClick}>
        <Search size={18} />
      </SearchButton>
      <InputSearchBar
        onChange={(e) => {
          setSearchInputValue(e.currentTarget.value)
        }}
        value={searchInputValue}
        ref={ref}
        {...props}
      />
      <ClearButton onClick={handleClearClick}>
        <X size={20} />
      </ClearButton>
    </ContainerSearchBar>
  )
})

SearchBar.displayName = 'SearchBar'
