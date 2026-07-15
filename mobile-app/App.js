import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, StatusBar, ScrollView, Modal, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera'; 
import axios from 'axios';

// ⚠️ REPLACE WITH YOUR IP or RENDER URL
//const API_IP = '10.0.2.2'; 
//const API_URL = `http://${API_IP}:3000/api`;
//const API_IP = '172.20.10.2'; 
//const API_URL = `http://${API_IP}:3000/api`; 
const API_URL = 'https://medibox-api.onrender.com/api';

const TEXT = {
  en: { appTitle: "MEDIBOX", subTitle: "Your Health Partner", loginTab: "Login", signupTab: "Sign Up", nameLabel: "Full Name", mobileLabel: "Mobile Number", passLabel: "Password", loginBtn: "SECURE LOGIN", regBtn: "CREATE ACCOUNT", welcome: "Welcome", dashTitle: "Namaste", listTitle: "Your Medicine List", stockLeft: "left", medAdded: "Medicine Added!", addTitle: "Add New Medicine", scanBtn: "Scan QR Label", medNameLabel: "Medicine Name", doseLabel: "Dosage", stockLabel: "Stock", saveBtn: "SAVE MEDICINE", cancel: "Cancel" },
  hi: { appTitle: "मेडीबॉक्स", subTitle: "आपका सेहत साथी", loginTab: "लॉग इन", signupTab: "साइन अप", nameLabel: "पूरा नाम", mobileLabel: "मोबाइल नंबर", passLabel: "पासवर्ड", loginBtn: "सुरक्षित लॉग इन", regBtn: "खाता बनाएं", welcome: "स्वागत है", dashTitle: "नमस्ते", listTitle: "आपकी दवा सूची", stockLeft: "बची हैं", medAdded: "दवा जुड़ गई!", addTitle: "नई दवा जोड़ें", scanBtn: "QR स्कैन करें", medNameLabel: "दवा का नाम", doseLabel: "खुराक", stockLabel: "स्टॉक", saveBtn: "दवा सहेजें", cancel: "रद्द करें" },
  es: { appTitle: "MEDIBOX", subTitle: "Tu socio de salud", loginTab: "Acceso", signupTab: "Registro", nameLabel: "Nombre", mobileLabel: "Móvil", passLabel: "Clave", loginBtn: "ENTRAR", regBtn: "CREAR CUENTA", welcome: "Bienvenido", dashTitle: "Hola", listTitle: "Lista de medicinas", stockLeft: "restante", medAdded: "¡Añadido!", addTitle: "Nueva medicina", scanBtn: "Escanear QR", medNameLabel: "Nombre", doseLabel: "Dosis", stockLabel: "Stock", saveBtn: "GUARDAR", cancel: "Cancelar" },
  fr: { appTitle: "MEDIBOX", subTitle: "Votre partenaire santé", loginTab: "Connexion", signupTab: "S'inscrire", nameLabel: "Nom", mobileLabel: "Mobile", passLabel: "Code", loginBtn: "CONNEXION", regBtn: "CRÉER", welcome: "Bienvenue", dashTitle: "Bonjour", listTitle: "Médicaments", stockLeft: "restant", medAdded: "Ajouté!", addTitle: "Nouveau", scanBtn: "Scanner", medNameLabel: "Nom", doseLabel: "Dose", stockLabel: "Stock", saveBtn: "SAUVER", cancel: "Annuler" },
  ar: { appTitle: "ميديبوكس", subTitle: "شريكك الصحي", loginTab: "دخول", signupTab: "سجل", nameLabel: "الاسم", mobileLabel: "جوال", passLabel: "سر", loginBtn: "دخول", regBtn: "حساب", welcome: "أهلا", dashTitle: "مرحبا", listTitle: "الأدوية", stockLeft: "باقي", medAdded: "تم!", addTitle: "إضافة", scanBtn: "مسح", medNameLabel: "اسم", doseLabel: "جرعة", stockLabel: "مخزن", saveBtn: "حفظ", cancel: "إلغاء" },
  zh: { appTitle: "MEDIBOX", subTitle: "您的健康伙伴", loginTab: "登录", signupTab: "注册", nameLabel: "全名", mobileLabel: "手机号", passLabel: "密码", loginBtn: "安全登录", regBtn: "创建账户", welcome: "欢迎", dashTitle: "你好", listTitle: "药物清单", stockLeft: "剩余", medAdded: "已添加!", addTitle: "新药物", scanBtn: "扫描", medNameLabel: "名称", doseLabel: "剂量", stockLabel: "库存", saveBtn: "保存", cancel: "取消" },
  bn: { appTitle: "মেডিবক্স", subTitle: "আপনার স্বাস্থ্য সঙ্গী", loginTab: "লগইন", signupTab: "নিবন্ধন", nameLabel: "নাম", mobileLabel: "মোবাইল", passLabel: "পাসওয়ার্ড", loginBtn: "লগইন", regBtn: "নিবন্ধন", welcome: "স্বাগতম", dashTitle: "নমস্তে", listTitle: "ওষুধ তালিকা", stockLeft: "বাকি", medAdded: "যোগ করা হয়েছে!", addTitle: "নতুন ওষুধ", scanBtn: "স্ক্যান", medNameLabel: "নাম", doseLabel: "ডোজ", stockLabel: "স্টক", saveBtn: "সংরক্ষণ", cancel: "বাতিল" },
  te: { appTitle: "మెడిబాక్స్", subTitle: "ఆరోగ్య భాగస్వామి", loginTab: "లాగిన్", signupTab: "రిజిస్టర్", nameLabel: "పేరు", mobileLabel: "మొబైల్", passLabel: "పాస్‌వర్డ్", loginBtn: "లాగిన్", regBtn: "ఖాతా", welcome: "స్వాగతం", dashTitle: "నమస్తే", listTitle: "మందుల జాబితా", stockLeft: "మిగిలి", medAdded: "జోడించబడింది!", addTitle: "కొత్త మందు", scanBtn: "స్కాన్", medNameLabel: "పేరు", doseLabel: "మోతాదు", stockLabel: "స్టాక్", saveBtn: "సేవ్", cancel: "రద్దు" },
  mr: { appTitle: "मेडीबॉक्स", subTitle: "आरोग्य सोबती", loginTab: "लॉगिन", signupTab: "नोंदणी", nameLabel: "नाव", mobileLabel: "मोबाईल", passLabel: "पासवर्ड", loginBtn: "लॉगिन", regBtn: "नोंदणी", welcome: "स्वागत", dashTitle: "नमस्ते", listTitle: "औषध सूची", stockLeft: "शिल्लक", medAdded: "जोडले!", addTitle: "नवीन औषध", scanBtn: "स्कॅन", medNameLabel: "नाव", doseLabel: "डोस", stockLabel: "साठा", saveBtn: "जतन", cancel: "รद्द" },
  ta: { appTitle: "மெடிபாக்ஸ்", subTitle: "சுகாதார துணை", loginTab: "உள்நுழை", signupTab: "பதிவு", nameLabel: "பெயர்", mobileLabel: "கைபேசி", passLabel: "கடவுச்சொல்", loginBtn: "உள்நுழை", regBtn: "பதிவு", welcome: "வரவேற்பு", dashTitle: "வணக்கம்", listTitle: "மருந்து பட்டியல்", stockLeft: "மீதி", medAdded: "சேர்க்கப்பட்டது!", addTitle: "புதிய மருந்து", scanBtn: "ஸ்கேன்", medNameLabel: "பெயர்", doseLabel: "அளவு", stockLabel: "இருப்பு", saveBtn: "சேமி", cancel: "ரத்து" },
  de: { appTitle: "MEDIBOX", subTitle: "Ihr Gesundheitspartner", loginTab: "Login", signupTab: "Anmelden", nameLabel: "Name", mobileLabel: "Mobil", passLabel: "Passwort", loginBtn: "LOGIN", regBtn: "KONTO", welcome: "Willkommen", dashTitle: "Hallo", listTitle: "Medikamente", stockLeft: "übrig", medAdded: "Hinzugefügt!", addTitle: "Neu", scanBtn: "Scan QR", medNameLabel: "Name", doseLabel: "Dosis", stockLabel: "Bestand", saveBtn: "SPEICHERN", cancel: "Abbrechen" },
  it: { appTitle: "MEDIBOX", subTitle: "Partner per la salute", loginTab: "Accedi", signupTab: "Iscriviti", nameLabel: "Nome", mobileLabel: "Cellulare", passLabel: "Password", loginBtn: "ACCEDI", regBtn: "CREA", welcome: "Benvenuto", dashTitle: "Ciao", listTitle: "Medicine", stockLeft: "rimasti", medAdded: "Aggiunto!", addTitle: "Nuovo", scanBtn: "Scansiona", medNameLabel: "Nome", doseLabel: "Dose", stockLabel: "Stock", saveBtn: "SALVA", cancel: "Annulla" },
  pt: { appTitle: "MEDIBOX", subTitle: "Parceiro de Saúde", loginTab: "Entrar", signupTab: "Criar", nameLabel: "Nome", mobileLabel: "Telemóvel", passLabel: "Senha", loginBtn: "ENTRAR", regBtn: "CRIAR", welcome: "Bem-vindo", dashTitle: "Olá", listTitle: "Remédios", stockLeft: "resta", medAdded: "Adicionado!", addTitle: "Novo", scanBtn: "Escanear", medNameLabel: "Nome", doseLabel: "Dose", stockLabel: "Estoque", saveBtn: "SALVAR", cancel: "Cancelar" },
  ru: { appTitle: "МЕДИБОКС", subTitle: "Партнер по здоровью", loginTab: "Вход", signupTab: "Учетка", nameLabel: "Имя", mobileLabel: "Телефон", passLabel: "Пароль", loginBtn: "ВОЙТИ", regBtn: "СОЗДАТЬ", welcome: "Привет", dashTitle: "Здравствуйте", listTitle: "Лекарства", stockLeft: "осталось", medAdded: "Добавлено!", addTitle: "Новое", scanBtn: "Сканировать", medNameLabel: "Имя", doseLabel: "Доза", stockLabel: "Запас", saveBtn: "СОХРАНИТЬ", cancel: "Отмена" },
  ja: { appTitle: "MEDIBOX", subTitle: "健康パートナー", loginTab: "ログイン", signupTab: "登録", nameLabel: "氏名", mobileLabel: "電話番号", passLabel: "パスワード", loginBtn: "ログイン", regBtn: "作成", welcome: "ようこそ", dashTitle: "こんにちは", listTitle: "薬リスト", stockLeft: "残り", medAdded: "追加！", addTitle: "新規追加", scanBtn: "スキャン", medNameLabel: "薬名", doseLabel: "服用量", stockLabel: "在庫", saveBtn: "保存", cancel: "キャンセル" },
  ko: { appTitle: "메디박스", subTitle: "건강 파트너", loginTab: "로그인", signupTab: "가입", nameLabel: "이름", mobileLabel: "번호", passLabel: "암호", loginBtn: "로그인", regBtn: "생성", welcome: "환영", dashTitle: "안녕", listTitle: "약 목록", stockLeft: "남음", medAdded: "추가됨!", addTitle: "새 약", scanBtn: "스캔", medNameLabel: "약 이름", doseLabel: "용량", stockLabel: "재고", saveBtn: "저장", cancel: "취소" },
  tr: { appTitle: "MEDIBOX", subTitle: "Sağlık Ortağınız", loginTab: "Giriş", signupTab: "Kayıt", nameLabel: "Ad Soyad", mobileLabel: "Mobil", passLabel: "Şifre", loginBtn: "GİRİŞ", regBtn: "HESAP AÇ", welcome: "Hoş geldin", dashTitle: "Merhaba", listTitle: "İlaç Listesi", stockLeft: "kaldı", medAdded: "Eklendi!", addTitle: "Yeni İlaç", scanBtn: "QR Tara", medNameLabel: "İlaç Adı", doseLabel: "Doz", stockLabel: "Stock", saveBtn: "KAYDET", cancel: "İptal" },
  pa: { appTitle: "ਮੇਡੀਬਾਕਸ", subTitle: "ਸਿਹਤ ਸਾਥੀ", loginTab: "ਲਾਗਇਨ", signupTab: "ਰਜਿਸਟਰ", nameLabel: "ਨਾਮ", mobileLabel: "ਮੋਬਾਈਲ", passLabel: "ਪਾਸਵਰਡ", loginBtn: "ਲਾਗਇਨ", regBtn: "ਬਣਾਓ", welcome: "ਜੀ ਆਇਆਂ ਨੂੰ", dashTitle: "ਨਮਸਤੇ", listTitle: "ਦਵਾਈ ਸੂਚੀ", stockLeft: "ਬਾਕੀ", medAdded: "ਜੋੜੀ ਗਈ!", addTitle: "ਨਵੀਂ ਦਵਾਈ", scanBtn: "ਸਕੈਨ", medNameLabel: "ਨਾਮ", doseLabel: "ਖੁਰਾਕ", stockLabel: "ਸਟਾਕ", saveBtn: "ਸੇਵ", cancel: "ਰੱਦ" },
  gu: { appTitle: "મેડીબોક્સ", subTitle: "સ્વાસ્થ્ય સાથી", loginTab: "લોગિન", signupTab: "નોંધણી", nameLabel: "નામ", mobileLabel: "મોબાઇલ", passLabel: "પાસવર્ડ", loginBtn: "લોગિન", regBtn: "બનાવો", welcome: "સ્વાગત", dashTitle: "નમસ્તે", listTitle: "દવા યાદી", stockLeft: "બાકી", medAdded: "ઉમેરાઈ!", addTitle: "નવી દવા", scanBtn: "સ્કેન", medNameLabel: "નામ", doseLabel: "ડોઝ", stockLabel: "સ્ટોક", saveBtn: "સેવ", cancel: "રદ" },
  kn: { appTitle: "ಮೆಡಿಬಾಕ್ಸ್", subTitle: "ಆರೋಗ್ಯ ಸಂಗಾತಿ", loginTab: "ಲಾಗಿನ್", signupTab: "ನೋಂದಣಿ", nameLabel: "ಹೆಸರು", mobileLabel: "ಮೊಬೈಲ್", passLabel: "ಪಾಸ್‌ವರ್ಡ್", loginBtn: "ಲಾಗಿನ್", regBtn: "ಖಾತೆ", welcome: "ಸ್ವಾಗತ", dashTitle: "ನಮಸ್ತೆ", listTitle: "ಔಷಧಿ ಪಟ್ಟಿ", stockLeft: "ಉಳಿದಿದೆ", medAdded: "ಸೇರಿಸಲಾಗಿದೆ!", addTitle: "ಹೊಸ ಔಷಧಿ", scanBtn: "ಸ್ಕ್ಯಾನ್", medNameLabel: "ಹೆಸರು", doseLabel: "ಡೋಸ್", stockLabel: "ಸ್ಟಾಕ್", saveBtn: "ಉಳಿಸಿ", cancel: "ರದ್ದು" }
};

export default function App() {
  const [currentView, setCurrentView] = useState('Login'); 
  const [langSearch, setLangSearch] = useState('');
  const [isLangModal, setIsLangModal] = useState(false);
  const [user, setUser] = useState(null);
  const [myMeds, setMyMeds] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [lang, setLang] = useState('en');
  const t = TEXT[lang];

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('Login');
  
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [medStock, setMedStock] = useState('');
  const [medType, setMedType] = useState('Tablet');

  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const handleAuth = async () => {
    setLoading(true);
    const endpoint = activeTab === 'Login' ? '/login' : '/register';
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, { name, mobile, password });
      if(res.data.success) {
        const userData = res.data.user || { name, mobile };
        setUser(userData);
        fetchMedicines(userData.mobile);
        setCurrentView('Dashboard');
      }
    } catch (error) { Alert.alert("Error", "Connection Failed"); } 
    finally { setLoading(false); }
  };

  const fetchMedicines = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/medicines/${userId}`);
      if(res.data.success) setMyMeds(res.data.meds);
    } catch (err) { console.log(err); }
  };

  const saveMedicine = async () => {
    try {
      await axios.post(`${API_URL}/add-medicine`, {
        userId: user.mobile, name: medName, dose: medDose, type: medType, stock: medStock || 10
      });
      Alert.alert("Success", t.medAdded);
      fetchMedicines(user.mobile);
      setCurrentView('Dashboard');
      setMedName(''); setMedDose(''); setMedStock('');
    } catch (err) { Alert.alert("Error", "Failed"); }
  };

  const deleteMedicine = (id) => {
    Alert.alert("Delete?", "Remove?", [
      { text: "Cancel" },
      { text: "Delete", style: 'destructive', onPress: async () => {
          await axios.delete(`${API_URL}/delete-medicine/${id}`);
          fetchMedicines(user.mobile);
      }}
    ]);
  };

  const markTaken = async (id) => {
    try {
      await axios.post(`${API_URL}/mark-taken`, { id });
      fetchMedicines(user.mobile); 
    } catch (err) { console.log(err); }
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanning(false);
    try {
      const parts = data.split(',');
      if(parts.length >= 1) {
        setMedName(parts[0]);
        if(parts[1]) setMedDose(parts[1]);
        Alert.alert("Scanned!", `Found: ${parts[0]}`);
      } else { setMedName(data); }
    } catch(e) { setMedName(data); }
  };

  const startScan = async () => {
    if (!permission) return;
    if (!permission.granted) {
      const result = await requestPermission();
      if (result.granted) setScanning(true);
      else Alert.alert("Permission", "Camera permission is required.");
    } else { setScanning(true); }
  };

  const filteredLangs = Object.keys(TEXT).filter(key => 
    key.toLowerCase().includes(langSearch.toLowerCase()) || 
    TEXT[key].appTitle.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar backgroundColor="#00695C" barStyle="dark-content" />
        
        {/* HEADER */}
        <View style={currentView === 'Login' ? styles.header : styles.dashHeader}>
           <View style={{flex: 1}}>
             <Text style={styles.title}>
                {currentView === 'Login' ? t.appTitle : t.dashTitle + ", " + (user?.name || "")}
             </Text>
             <Text style={styles.subtitle}>
                {currentView === 'Login' ? t.subTitle : t.listTitle}
             </Text>
           </View>
           
           {/* ARROW LANGUAGE SELECTOR */}
           <View style={styles.langBar}>
             <TouchableOpacity onPress={() => {
                const keys = Object.keys(TEXT);
                const prevIndex = (keys.indexOf(lang) - 1 + keys.length) % keys.length;
                setLang(keys[prevIndex]);
             }}>
               <Text style={styles.arrow}>◀</Text>
             </TouchableOpacity>

             <TouchableOpacity onPress={() => setIsLangModal(true)} style={styles.langCodeBox}>
               <Text style={styles.langText}>{lang.toUpperCase()}</Text>
             </TouchableOpacity>

             <TouchableOpacity onPress={() => {
                const keys = Object.keys(TEXT);
                const nextIndex = (keys.indexOf(lang) + 1) % keys.length;
                setLang(keys[nextIndex]);
             }}>
               <Text style={styles.arrow}>▶</Text>
             </TouchableOpacity>
           </View>
        </View>

        {/* LOGIN SCREEN */}
        {currentView === 'Login' && (
          <View style={styles.bottomSheet}>
            <View style={styles.tabContainer}>
              <TouchableOpacity style={[styles.tab, activeTab === 'Login' && styles.activeTab]} onPress={() => setActiveTab('Login')}>
                <Text style={styles.tabText}>{t.loginTab}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tab, activeTab === 'Signup' && styles.activeTab]} onPress={() => setActiveTab('Signup')}>
                <Text style={styles.tabText}>{t.signupTab}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.form}>
              {activeTab === 'Signup' && (
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>{t.nameLabel}</Text>
                  <TextInput style={styles.input} placeholder={t.nameLabel} value={name} onChangeText={setName} />
                </View>
              )}
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>{t.mobileLabel}</Text>
                <TextInput style={styles.input} placeholder="9876543210" keyboardType="phone-pad" value={mobile} onChangeText={setMobile} />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>{t.passLabel}</Text>
                <TextInput style={styles.input} placeholder="••••••" secureTextEntry value={password} onChangeText={setPassword} />
              </View>
              <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{activeTab === 'Login' ? t.loginBtn : t.regBtn}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* DASHBOARD SCREEN */}
        {currentView === 'Dashboard' && (
          <>
            <ScrollView style={styles.dashContent}>
              {myMeds.map((med, index) => (
                <View key={index} style={styles.medCard}>
                  <View style={styles.medIcon}><Text style={{fontSize: 24}}>💊</Text></View>
                  <View style={styles.medInfo}>
                    <Text style={styles.medName}>{med.name}</Text>
                    <Text style={styles.medDose}>{med.dose}</Text>
                    <Text style={{fontSize: 12, color: med.stock < 5 ? 'red' : 'green'}}>{med.stock} {t.stockLeft}</Text>
                  </View>
                  <TouchableOpacity style={styles.checkBtn} onPress={() => markTaken(med._id)}><Text style={styles.checkText}>✓</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteMedicine(med._id)}><Text style={styles.deleteText}>🗑️</Text></TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.fab} onPress={() => setCurrentView('AddMed')}><Text style={styles.fabText}>+</Text></TouchableOpacity>
          </>
        )}

        {/* ADD MEDICINE SCREEN */}
        {currentView === 'AddMed' && (
          <View style={styles.bottomSheet}>
            <Text style={styles.formHeader}>{t.addTitle}</Text>
            <TouchableOpacity style={styles.scanBtn} onPress={startScan}><Text style={styles.scanText}>📷 {t.scanBtn}</Text></TouchableOpacity>
            <TextInput style={styles.input} placeholder={t.medNameLabel} value={medName} onChangeText={setMedName} />
            <TextInput style={styles.input} placeholder={t.doseLabel} value={medDose} onChangeText={setMedDose} />
            <TextInput style={styles.input} placeholder={t.stockLabel} keyboardType="numeric" value={medStock} onChangeText={setMedStock} />
            <View style={styles.row}>
              <TouchableOpacity style={[styles.typeBtn, medType === 'Tablet' && styles.activeType]} onPress={()=>setMedType('Tablet')}><Text style={styles.typeText}>Tablet</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.typeBtn, medType === 'Syrup' && styles.activeType]} onPress={()=>setMedType('Syrup')}><Text style={styles.typeText}>Syrup</Text></TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={saveMedicine}><Text style={styles.buttonText}>{t.saveBtn}</Text></TouchableOpacity>
            <TouchableOpacity style={{marginTop: 20, alignSelf:'center'}} onPress={() => setCurrentView('Dashboard')}><Text style={{color:'#666'}}>{t.cancel}</Text></TouchableOpacity>
          </View>
        )}

        {/* SEARCH MODAL */}
        <Modal visible={isLangModal} animationType="slide">
          <SafeAreaView style={{flex: 1, backgroundColor: '#FFF'}}>
            <View style={styles.searchHeader}>
              <TextInput placeholder="Search language..." style={styles.searchInput} onChangeText={setLangSearch} />
              <TouchableOpacity onPress={() => setIsLangModal(false)}><Text style={{color: '#008080', fontWeight: 'bold'}}>CANCEL</Text></TouchableOpacity>
            </View>
            <ScrollView>
              {filteredLangs.map((key) => (
                <TouchableOpacity key={key} style={styles.langItem} onPress={() => { setLang(key); setIsLangModal(false); }}>
                  <Text style={styles.langItemText}>{key.toUpperCase()} - {TEXT[key].appTitle}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {/* CAMERA MODAL */}
        {scanning && (
          <Modal visible={scanning} onRequestClose={() => setScanning(false)}>
            <CameraView style={StyleSheet.absoluteFillObject} onBarcodeScanned={handleBarCodeScanned} />
            <TouchableOpacity style={styles.closeScan} onPress={() => setScanning(false)}><Text style={{color:'white', fontWeight:'bold'}}>CLOSE</Text></TouchableOpacity>
          </Modal>
        )}

      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E0F2F1' },
  header: { backgroundColor: '#008080', padding: 20, paddingTop: 40, flexDirection: 'row', alignItems: 'center' },
  dashHeader: { backgroundColor: '#008080', padding: 20, paddingTop: 40, flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  subtitle: { color: '#B2DFDB', fontSize: 14 },
  langBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  arrow: { color: 'white', fontSize: 18, paddingHorizontal: 10 },
  langCodeBox: { paddingHorizontal: 10 },
  langText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  searchHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  searchInput: { flex: 1, backgroundColor: '#F2F2F2', padding: 12, borderRadius: 10, marginRight: 15 },
  langItem: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F2F2F2' },
  langItemText: { fontSize: 18, color: '#333' },
  bottomSheet: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, marginTop: 20 },
  tabContainer: { flexDirection: 'row', marginBottom: 25, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  activeTab: { borderBottomWidth: 3, borderBottomColor: '#008080' },
  tabText: { fontSize: 16, color: '#999', fontWeight: '600' },
  inputWrapper: { marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 5, color: '#008080', fontSize: 13 },
  input: { backgroundColor: '#F2F2F2', padding: 15, borderRadius: 10, marginBottom: 15 },
  button: { backgroundColor: '#004D40', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  dashContent: { padding: 20 },
  medCard: { backgroundColor: 'white', flexDirection: 'row', padding: 15, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 2 },
  medIcon: { width: 50, height: 50, backgroundColor: '#E0F2F1', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  medInfo: { flex: 1 },
  medName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  medDose: { fontSize: 13, color: '#666' },
  checkBtn: { width: 40, height: 40, backgroundColor: '#E8F5E9', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checkText: { fontSize: 18, color: 'green' },
  deleteBtn: { width: 40, height: 40, backgroundColor: '#FFEBEE', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  deleteText: { fontSize: 16 },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, backgroundColor: '#004D40', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: 'white', fontSize: 30 },
  formHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  typeBtn: { flex: 0.48, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#008080', alignItems: 'center' },
  activeType: { backgroundColor: '#008080' },
  typeText: { color: '#008080', fontWeight: 'bold' },
  scanBtn: { backgroundColor: '#E0F2F1', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#008080' },
  scanText: { color: '#008080', fontWeight: 'bold' },
  closeScan: { position: 'absolute', bottom: 50, alignSelf: 'center', backgroundColor: 'red', padding: 15, borderRadius: 10 }
});