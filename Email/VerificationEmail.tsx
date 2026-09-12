import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
} from '@react-email/components';

interface ResendVerificationEmailProps {
    username: string;
    otp: string;
}

export function ResendVerificationEmail({
    username,
    otp
}: ResendVerificationEmailProps) {
    return (
        <Html lang="en">
            <Head>
                <title>Verification Code</title>

                <Font
                    fontFamily="Roboto"
                    fallbackFontFamily="Verdana"
                    webFont={{
                        url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
                        format: 'woff2',
                    }}
                    fontWeight={400}
                    fontStyle="normal"
                />
            </Head>

            <Preview>Your new verification code: {otp}</Preview>

            <Section>
                <Row>
                    <Heading as="h2">Hello {username},</Heading>
                </Row>

                <Row>
                    <Text>
                        You requested a new verification code. Please use the code below
                        to complete your registration.
                    </Text>
                </Row>

                <Row>
                    <Text
                        style={{
                            fontSize: '28px',
                            fontWeight: 'bold',
                            letterSpacing: '6px',
                            textAlign: 'center',
                            margin: '24px 0',
                        }}
                    >
                        {otp}
                    </Text>
                </Row>

                <Row>
                    <Text>
                        This code is intended for your account only. If you did not
                        request a new verification code, you can safely ignore this email.
                    </Text>
                </Row>

                <Row>
                    <Text
                        style={{
                            fontSize: '12px',
                            color: '#666666',
                            marginTop: '24px',
                        }}
                    >
                        Please do not share this verification code with anyone.
                    </Text>
                </Row>
            </Section>
        </Html>
    );
}
