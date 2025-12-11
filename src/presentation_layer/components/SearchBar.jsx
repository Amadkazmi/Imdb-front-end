import React from 'react'
import { Form, Button, InputGroup } from 'react-bootstrap';

const SearchBar = () => {
    const searchText = React.useRef(null)

    const handleGptSearchCLick = () => {
        if (searchText.current) {
            const query = searchText.current.value.trim()
            if (query) {
                console.log("Searching for movies with query:", query)
                // Add your search logic here
            }
        }
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleGptSearchCLick()
        }
    }

    return (
        <div className="d-flex justify-content-center w-100">
            <Form className="w-100" onSubmit={(e) => e.preventDefault()}>
                <InputGroup size="lg" style={{ maxWidth: '600px' }}>
                    <Form.Control 
                        type="text" 
                        ref={searchText} 
                        placeholder="Search for movies, TV shows, celebrities..." 
                        className="bg-light text-light border-warning"
                        onKeyPress={handleKeyPress}
                    />
                    <Button 
                        variant="warning" 
                        onClick={handleGptSearchCLick}
                        className="px-4"
                    >
                        <i className="bi bi-search"></i> Search
                    </Button>
                </InputGroup>
            </Form>
        </div>
    )
}

export default SearchBar