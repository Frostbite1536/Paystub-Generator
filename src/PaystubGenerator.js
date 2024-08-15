import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Divider,
  Heading,
  Text,
  VStack,
  HStack,
  Flex,
  Grid,
  GridItem,
  useToast,
  Image as ChakraImage,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const LOGO_URL = "/images/evmos-dao-logo-white.png";

const theme = extendTheme({
  components: {
    Input: {
      baseStyle: {
        field: {
          color: "white",
          _placeholder: { color: "gray.400" },
        },
      },
      variants: {
        outline: {
          field: {
            _focus: {
              borderColor: "#ff5a5a",
              boxShadow: "0 0 0 1px #ff5a5a",
            },
          },
        },
      },
    },
  },
});

const PaystubGenerator = () => {
  const [paystubData, setPaystubData] = useState({
    name: "",
    payPeriodStart: "",
    payPeriodEnd: "",
    payDate: "",
    grossPay: "",
    ytdGross: "",
    transactionHash: "",
    safeUrl: "",
  });

  const [logoDataUrl, setLogoDataUrl] = useState("");
  const paystubRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      setLogoDataUrl(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      console.error("Failed to load the logo");
      setLogoDataUrl("");
    };
    img.src = LOGO_URL;
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaystubData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() + offset * 60 * 1000);
    return adjustedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  const generatePDF = async () => {
    if (!paystubRef.current) {
      toast({
        title: "Error",
        description: "Could not find paystub content.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const canvas = await html2canvas(paystubRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("evmos-dao-paystub.pdf");

      toast({
        title: "Success",
        description: "Paystub PDF generated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: `Failed to generate PDF: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box
        maxW="4xl"
        mx="auto"
        p="8"
        bg="#1d2126"
        borderRadius="lg"
        shadow="xl"
        color="white"
      >
        <Box mb="10" shadow="lg" p="8" bg="#292d34" borderRadius="lg">
          <Heading size="lg" mb="6" textAlign="center" color="#ff5a5a">
            Evmos DAO Paystub Generator
          </Heading>
          <VStack spacing="6">
            <Input
              name="name"
              placeholder="Name"
              value={paystubData.name}
              onChange={handleInputChange}
              focusBorderColor="#ff5a5a"
              size="lg"
              bg="#1d2126"
              color="white"
            />
            <Grid templateColumns="repeat(2, 1fr)" gap={6} w="full">
              <GridItem>
                <Input
                  name="payPeriodStart"
                  type="date"
                  placeholder="Pay Period Start"
                  value={paystubData.payPeriodStart}
                  onChange={handleInputChange}
                  focusBorderColor="#ff5a5a"
                  size="lg"
                  bg="#1d2126"
                  color="white"
                />
              </GridItem>
              <GridItem>
                <Input
                  name="payPeriodEnd"
                  type="date"
                  placeholder="Pay Period End"
                  value={paystubData.payPeriodEnd}
                  onChange={handleInputChange}
                  focusBorderColor="#ff5a5a"
                  size="lg"
                  bg="#1d2126"
                  color="white"
                />
              </GridItem>
            </Grid>
            <Input
              name="payDate"
              type="date"
              placeholder="Pay Date"
              value={paystubData.payDate}
              onChange={handleInputChange}
              focusBorderColor="#ff5a5a"
              size="lg"
              bg="#1d2126"
              color="white"
            />
            <Input
              name="grossPay"
              type="number"
              placeholder="Gross Pay"
              value={paystubData.grossPay}
              onChange={handleInputChange}
              focusBorderColor="#ff5a5a"
              size="lg"
              bg="#1d2126"
              color="white"
            />
            <Input
              name="ytdGross"
              type="number"
              placeholder="YTD Gross"
              value={paystubData.ytdGross}
              onChange={handleInputChange}
              focusBorderColor="#ff5a5a"
              size="lg"
              bg="#1d2126"
              color="white"
            />
            <Input
              name="transactionHash"
              placeholder="Transaction Hash"
              value={paystubData.transactionHash}
              onChange={handleInputChange}
              focusBorderColor="#ff5a5a"
              size="lg"
              bg="#1d2126"
              color="white"
            />
            <Input
              name="safeUrl"
              placeholder="Safe URL"
              value={paystubData.safeUrl}
              onChange={handleInputChange}
              focusBorderColor="#ff5a5a"
              size="lg"
              bg="#1d2126"
              color="white"
            />
            <Button
              colorScheme="red"
              size="lg"
              mt="4"
              w="full"
              onClick={generatePDF}
            >
              Generate Paystub
            </Button>
          </VStack>
        </Box>

        <Box shadow="lg" p="8" bg="#292d34" borderRadius="lg" ref={paystubRef}>
          <Flex
            justify="space-between"
            align="center"
            bg="#1d2126"
            p="6"
            borderRadius="lg"
          >
            {logoDataUrl ? (
              <ChakraImage
                src={logoDataUrl}
                alt="Evmos DAO Logo"
                height="64px"
                width="auto"
              />
            ) : (
              <Box height="64px" width="64px" bg="#ff5a5a">
                <Text
                  color="white"
                  fontWeight="bold"
                  textAlign="center"
                  lineHeight="64px"
                >
                  EVMOS
                </Text>
              </Box>
            )}
            <Box textAlign="right">
              <Heading size="md" color="#ff5a5a">
                Evmos DAO
              </Heading>
              <Text color="#ff5a5a">info@evmosdao.org</Text>
            </Box>
          </Flex>
          <Box p="6">
            <Heading size="lg" mb="6" color="#ff5a5a">
              Earnings Statement
            </Heading>
            <VStack align="stretch" spacing="6" mb="8">
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="bold" color="#ff5a5a">
                    Name
                  </Text>
                  <Text color="white">{paystubData.name || "N/A"}</Text>
                </Box>
                <Box textAlign="right">
                  <Text fontWeight="bold" color="#ff5a5a">
                    Pay Date
                  </Text>
                  <Text color="white">{formatDate(paystubData.payDate)}</Text>
                </Box>
              </HStack>
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="bold" color="#ff5a5a">
                    Pay Period
                  </Text>
                  <Text color="white">
                    {formatDate(paystubData.payPeriodStart)} -{" "}
                    {formatDate(paystubData.payPeriodEnd)}
                  </Text>
                </Box>
              </HStack>
            </VStack>
            <Divider mb="8" />
            <table width="100%">
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      paddingBottom: "12px",
                      color: "#ff5a5a",
                      fontSize: "16px",
                    }}
                  >
                    Earnings
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      paddingBottom: "12px",
                      color: "#ff5a5a",
                      fontSize: "16px",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      paddingBottom: "12px",
                      color: "#ff5a5a",
                      fontSize: "16px",
                    }}
                  >
                    YTD
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "12px 0",
                      color: "white",
                      fontSize: "16px",
                    }}
                  >
                    Regular Pay
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "12px 0",
                      color: "white",
                      fontSize: "16px",
                    }}
                  >
                    {formatCurrency(paystubData.grossPay)}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      padding: "12px 0",
                      color: "white",
                      fontSize: "16px",
                    }}
                  >
                    {formatCurrency(paystubData.ytdGross)}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td
                    style={{
                      paddingTop: "12px",
                      fontWeight: "bold",
                      color: "#ff5a5a",
                      fontSize: "16px",
                    }}
                  >
                    Total
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingTop: "12px",
                      fontWeight: "bold",
                      color: "#ff5a5a",
                      fontSize: "16px",
                    }}
                  >
                    {formatCurrency(paystubData.grossPay)}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingTop: "12px",
                      fontWeight: "bold",
                      color: "#ff5a5a",
                      fontSize: "16px",
                    }}
                  >
                    {formatCurrency(paystubData.ytdGross)}
                  </td>
                </tr>
              </tfoot>
            </table>
            <Divider my="8" />
            <VStack align="start" spacing="3" fontSize="md">
              <Text>
                <strong style={{ color: "#ff5a5a" }}>Transaction Hash:</strong>{" "}
                <span style={{ color: "white" }}>
                  {paystubData.transactionHash || "N/A"}
                </span>
              </Text>
              <Text>
                <strong style={{ color: "#ff5a5a" }}>Safe URL:</strong>{" "}
                <span style={{ color: "white" }}>
                  {paystubData.safeUrl || "N/A"}
                </span>
              </Text>
            </VStack>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default PaystubGenerator;
