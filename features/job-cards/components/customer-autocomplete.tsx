"use client"

import * as React from "react"
import { Check, ChevronsUpDown, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAuth } from "@/contexts/auth-context"
import { FormControl } from "@/components/ui/form"
import { firebaseService, COLLECTIONS } from "@/lib/firebase-service"

interface Customer {
  id: string
  name: string
  phone: string
  alternatePhone?: string
  address?: string
  email?: string
}

interface JobCardData {
  id: string
  customerName?: string
  phone?: string
  alternatePhone?: string
  address?: string
}

interface CustomerAutocompleteProps {
  value: string
  onSelect: (customer: Customer | null) => void
  onChange: (value: string) => void
  placeholder?: string
}

export function CustomerAutocomplete({
  value,
  onSelect,
  onChange,
  placeholder = "Search or enter customer name...",
}: CustomerAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [customers, setCustomers] = React.useState<Customer[]>([])
  const [loading, setLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(null)
  const { user } = useAuth()

  // Fetch unique customers from job cards (most accurate source)
  const fetchCustomersFromJobCards = React.useCallback(async () => {
    if (!user?.uid) return

    setLoading(true)
    try {
      // Get all job cards
      const jobCards = await firebaseService.getAll<JobCardData>(user.uid, COLLECTIONS.JOB_CARDS)
      
      // Extract unique customers by phone number (phone is unique identifier)
      const customerMap = new Map<string, Customer>()
      
      jobCards.forEach((jobCard) => {
        if (jobCard.customerName && jobCard.phone) {
          // Use phone as key to avoid duplicates
          const key = jobCard.phone
          if (!customerMap.has(key)) {
            customerMap.set(key, {
              id: jobCard.id, // Use job card ID as reference
              name: jobCard.customerName,
              phone: jobCard.phone,
              alternatePhone: jobCard.alternatePhone || "",
              address: jobCard.address || "",
            })
          } else {
            // If customer exists, update with latest data (newest job card wins)
            const existing = customerMap.get(key)!
            customerMap.set(key, {
              ...existing,
              name: jobCard.customerName,
              alternatePhone: jobCard.alternatePhone || existing.alternatePhone,
              address: jobCard.address || existing.address,
            })
          }
        }
      })
      
      setCustomers(Array.from(customerMap.values()))
    } catch (error) {
      console.error("Error fetching customers from job cards:", error)
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  // Initial fetch on mount
  React.useEffect(() => {
    fetchCustomersFromJobCards()
  }, [fetchCustomersFromJobCards])

  // Refetch when popover opens to ensure latest data & reset search query
  React.useEffect(() => {
    if (open) {
      setSearchQuery("")
      fetchCustomersFromJobCards() // Refresh customer list every time popover opens
    }
  }, [open, fetchCustomersFromJobCards])

  // Filter customers based on search query (not the selected value)
  const filteredCustomers = React.useMemo(() => {
    if (!searchQuery.trim()) return customers
    const searchTerm = searchQuery.toLowerCase().trim()
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm) ||
        (customer.address && customer.address.toLowerCase().includes(searchTerm))
    )
  }, [customers, searchQuery])

  // Track if user has explicitly interacted to prevent auto-selection
  const [hasUserInteracted, setHasUserInteracted] = React.useState(false)

  const handleSelect = (customer: Customer) => {
    // Only proceed if user has interacted with the dropdown (not auto-triggered)
    if (!hasUserInteracted) {
      console.log('[Autocomplete] Ignoring auto-triggered selection')
      return
    }
    
    // Don't trigger if selecting the same customer that's already selected
    if (value.toLowerCase() === customer.name.toLowerCase()) {
      console.log('[Autocomplete] Same customer already selected, just closing')
      setOpen(false)
      return
    }
    
    console.log('[Autocomplete] User selected customer:', customer.name, customer.phone)
    onChange(customer.name)
    setSelectedCustomerId(customer.id)
    onSelect(customer)
    setOpen(false)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setHasUserInteracted(true) // User is typing = interacting
  }

  // Handle using the search query as a new customer name
  const handleUseNewCustomer = () => {
    if (searchQuery.trim()) {
      console.log('[Autocomplete] User adding new customer:', searchQuery.trim())
      onChange(searchQuery.trim())
      setSelectedCustomerId(null)
      onSelect(null) // Clear any previous selection - New customer has no history
      setOpen(false)
    }
  }

  // When popover closes, if there's a search query and no selection, use it as new customer
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      // Reset interaction flag when opening
      setHasUserInteracted(false)
    } else if (!isOpen && searchQuery.trim() && !selectedCustomerId && hasUserInteracted) {
      // Only process if user actually interacted
      // If closing with a search query and no customer selected, use the search query
      const matchingCustomer = customers.find(
        c => c.name.toLowerCase() === searchQuery.toLowerCase()
      )
      if (!matchingCustomer) {
        console.log('[Autocomplete] Closing with new customer name:', searchQuery.trim())
        onChange(searchQuery.trim())
        onSelect(null)
      }
    }
    setOpen(isOpen)
  }

  // Mark as interacted when user clicks on an item
  const handleItemClick = (customer: Customer) => {
    setHasUserInteracted(true)
    // Use a small delay to ensure the flag is set before handleSelect runs
    setTimeout(() => handleSelect(customer), 0)
  }

  // Check if current value matches a customer (for showing check mark)
  const isCustomerSelected = (customer: Customer) => {
    return selectedCustomerId === customer.id || 
           value.toLowerCase() === customer.name.toLowerCase()
  }

  // Handle direct input change (editing the customer name)
  const handleDirectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    setSearchQuery(newValue)
    setHasUserInteracted(true)
    setSelectedCustomerId(null) // Clear selection when manually editing
    
    // Open dropdown to show suggestions if there's text
    if (!open && newValue.trim()) {
      setOpen(true)
    }
    
    // If the name is being edited (not matching any existing customer), notify parent
    const matchingCustomer = customers.find(c => c.name.toLowerCase() === newValue.toLowerCase())
    if (!matchingCustomer) {
      onSelect(null) // New/edited customer name
    }
  }

  // Handle focus on input - show dropdown with suggestions
  const handleInputFocus = () => {
    setSearchQuery(value) // Set search query to current value for filtering
    setHasUserInteracted(true)
  }

  // Toggle dropdown when clicking the chevron icon
  const handleDropdownToggle = () => {
    if (!open) {
      setSearchQuery("") // Reset search to show all customers
    }
    setOpen(!open)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <FormControl>
          <div className="relative flex items-center">
            <User className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={value}
              onChange={handleDirectInputChange}
              onFocus={handleInputFocus}
              placeholder={placeholder}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm",
                "ring-offset-background placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDropdownToggle()
              }}
              className="absolute right-2 p-1 hover:bg-muted rounded"
            >
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search customers..."
            value={searchQuery}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Loading customers...
              </div>
            ) : (
              <>
                {/* Show "Add new customer" option when there's a search query */}
                {searchQuery.trim() && (
                  <CommandGroup heading="New Customer">
                    <CommandItem
                      value="new-customer"
                      onSelect={() => {
                        setHasUserInteracted(true)
                        handleUseNewCustomer()
                      }}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        <span>Add &quot;{searchQuery.trim()}&quot; as new customer</span>
                      </div>
                    </CommandItem>
                  </CommandGroup>
                )}
                
                {/* Show existing customers */}
                {filteredCustomers.length > 0 && (
                  <CommandGroup heading={`Existing Customers (${filteredCustomers.length})`}>
                    {filteredCustomers.map((customer) => (
                      <CommandItem
                        key={customer.id}
                        value={customer.id}
                        onSelect={() => handleItemClick(customer)}
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col gap-0.5 flex-1">
                          <div className="flex items-center gap-2">
                            <Check
                              className={cn(
                                "h-4 w-4",
                                isCustomerSelected(customer) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="font-medium">{customer.name}</span>
                          </div>
                          <div className="ml-6 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{customer.phone}</span>
                            {customer.address && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[150px]">{customer.address}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                
                {/* Show message when no customers and no search query */}
                {filteredCustomers.length === 0 && !searchQuery.trim() && (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No customers yet. Start typing to add one.
                  </div>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

