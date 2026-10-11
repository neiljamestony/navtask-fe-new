export const MobileRegistrationCircleTextStyle1 = { fontSize: 11, color: 'black' };

export const MobileRegistrationCheckTextStyle2 = { fontSize: 15 };

export const MobileRegistrationCheckTextStyle3 = { fontSize: 15 };

export const MobileRegistrationCircleTextStyle4 = { fontSize: 11, color: 'black' };

export const MobileRegistrationCheckTextStyle5 = { fontSize: 18 };

export const MobileRegistrationCircleTextStyle6 = { fontSize: 11, color: 'black' };

export const MobileRegistrationBoxTextStyle7 = { display: "flex", justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: "100vh" };

export const MobileRegistrationformSizeStyle8 = { height: '80%', width: '100%', margin: 30 };

export const MobileRegistrationBoxTextStyle9 = (vars: Record<string, any>) => ({ 
                                    textAlign: "left", 
                                    color: vars.passwordStrength === "Weak" ? '#d32f2f' : '#1976d2', 
                                    fontSize: 13, 
                                    fontFamily: 'Roboto',
                                    display: vars.formData.username === "" || vars.formData.password === "" ? "none" : "block"
                                });

export const MobileRegistrationListSpacingStyle10 = { margin: 0, padding: 0 };

export const MobileRegistrationListItemSpacingStyle11 = { margin: 0, padding: 0 };

export const MobileRegistrationButtonTextStyle12 = { textTransform: 'none'};

export const MobileRegistrationTypographyTextStyle13 = { fontFamily: 'Roboto', fontSize: 20, fontWeight: 'medium' };

export const MobileRegistrationspanTextStyle14 = { fontFamily: "Roboto", fontWeight: "bold", color: "#1976d2"};
