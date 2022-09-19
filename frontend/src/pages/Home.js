import { Typography, Container, Box, Button, Stack } from "@mui/material";
import React from "react";
import BottomNav from "../components/BottomNav";
import NavBar from "../components/NavBar";
import Login from "../components/user/Login";

const Home = () => {
  return (
    <>
      <Login />
      <NavBar />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Sindhu Tech Edi
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Something short and leading about the collection below—its
              contents, the creator, etc. Make it short and sweet, but not too
              short so folks don&apos;t simply skip over it entirely.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained">Login</Button>
            </Stack>
          </Container>
        </Box>
      </main>
      <BottomNav />
    </>
  );
};

export default Home;
