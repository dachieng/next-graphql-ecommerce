import React from "react";
import { useTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import Header from "../../components/header";
import Head from "next/head";
import {
  Card,
  CardMedia,
  Container,
  CssBaseline,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { gql } from "@apollo/client";
import client from "../api/apollo-client";

const useStyles = makeStyles(() => ({
  card: {
    height: "80vh",
    display: "flex",
    flexDirection: "column",
    borderRadius: "0",
  },
  container: {
    paddingTop: useTheme().spacing(2),
  },
  img: {
    maxWidth: "100%",
    height: "80vh",
  },
  paperRight: {
    padding: useTheme().spacing(0),
    borderRadius: "0",
    paddingLeft: 40,
    paddingTop: 30,
    ["@media (max-width:600px)"]: {
      paddingLeft: 0,
      paddingTop: 10,
    },
  },
}));

const Product = ({ product, categories }) => {
  const router = useRouter();
  const classes = useStyles();

  // return loading if page has not fetched the data
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Head>
        <title>{product.id}</title>
      </Head>
      <Header data={categories} />
      <Container component="main" maxWidth="md" className={classes.container}>
        <CssBaseline />
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.img}
                image={product.productImage[0].image}
                component="img"
                src={product.productImage[0].image}
              />
            </Card>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Paper className={classes.paperRight} elevation={0}>
              <Typography component="h1" fontSize={18} fontWeight="400">
                {product.title}
              </Typography>
              <Typography component="p" fontSize={22} fontWeight="900" m={0}>
                $ {product.regularPrice}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Product;

// we need getStaticPaths since we r pre rendering
export async function getStaticPaths() {
  return {
    paths: [{ params: { productId: "sneakers" } }],
    fallback: true,
  };
}

export const getStaticProps = async ({ params }) => {
  const response = await fetch(
    `http://localhost:8000/product/${params.productId}`
  );
  const g_product = await response.json();

  const res = await fetch("http://localhost:8000/categories");
  const categories = await res.json();

  const PRODUCT_DATA = gql`
    query ($slug: String!) {
      productDetail(slug: $slug) {
        title
        description
        regularPrice
        productImage {
          id
          image
        }
      }
    }
  `;

  const slug = params.productId;
  const { data } = await client.query({
    query: PRODUCT_DATA,
    variables: { slug },
  });

  console.log(data);

  return {
    props: {
      product: data.productDetail,
      categories,
    },
  };
};
