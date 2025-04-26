import Box from "@mui/material/Box";


export default function Protocol() {
    return (
        <Box sx={{height: '100vh', overflow: 'hidden'}}>
            <embed
                src="http://0.0.0.0:8000/generate-pdf"
                type="application/pdf"
                width="100%"
                height="100%"
                style={{border: 'none'}}
            />
        </Box>
    )
}