import { Box, Button, Paper, TextField } from "@mui/material";

export default function Login() {
    return (
        <div className="p-20">
            <Box className='w-1/2 p-8 m-auto'>
                <Paper elevation={16} className="p-10">
                    <h1 className="text-center font-bold text-3xl">Login Here</h1>
                    <form>
                        <label className="text-lg">Email</label>
                        <TextField required className="my-2" fullWidth id="outlined" label="Enter Name" variant="outlined" size="small" />
                        <label className="text-lg">Password</label>
                        <TextField required fullWidth id="outlined-password-input" label="Enter Password" type="password" size="small" className="my-3" />
                        <Button fullWidth type="submit" className="mt-3" style={{ backgroundColor: 'black', color: 'white' }}>Submit</Button>
                    </form>
                </Paper>
            </Box>
        </div>
    )
} 