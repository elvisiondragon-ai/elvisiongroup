import React, { useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonList, IonRadioGroup, IonListHeader, IonLabel, IonRadio, IonButton, IonItem } from '@ionic/react';

const FormAI: React.FC = () => {
  const [q1, setQ1] = useState<string | undefined>(undefined);
  const [q2, setQ2] = useState<string | undefined>(undefined);
  const [q3, setQ3] = useState<string | undefined>(undefined);
  const [q4, setQ4] = useState<string | undefined>(undefined);
  const [q5, setQ5] = useState<string | undefined>(undefined);

  const handleSubmit = () => {
    // Here you would typically send the survey data to a backend
    console.log({ q1, q2, q3, q4, q5 });
    alert('Survey Submitted! Check console for data.');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>5-Question Smart Survey</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonRadioGroup value={q1} onIonChange={e => setQ1(e.detail.value)}>
            <IonListHeader>
              <IonLabel>1. Apakah bisnis Anda sudah punya website yang aktif dan menghasilkan?</IonLabel>
            </IonListHeader>
            <IonItem>
              <IonLabel>Sudah</IonLabel>
              <IonRadio slot="start" value="Sudah" />
            </IonItem>
            <IonItem>
              <IonLabel>Ada tapi tidak efektif</IonLabel>
              <IonRadio slot="start" value="Ada tapi tidak efektif" />
            </IonItem>
            <IonItem>
              <IonLabel>Belum</IonLabel>
              <IonRadio slot="start" value="Belum" />
            </IonItem>
          </IonRadioGroup>

          <IonRadioGroup value={q2} onIonChange={e => setQ2(e.detail.value)}>
            <IonListHeader>
              <IonLabel>2. Apakah Anda membutuhkan sistem otomatis seperti auto-reply / AI untuk membantu chat dan operasional?</IonLabel>
            </IonListHeader>
            <IonItem>
              <IonLabel>Sangat perlu</IonLabel>
              <IonRadio slot="start" value="Sangat perlu" />
            </IonItem>
            <IonItem>
              <IonLabel>Perlu</IonLabel>
              <IonRadio slot="start" value="Perlu" />
            </IonItem>
            <IonItem>
              <IonLabel>Tidak perlu</IonLabel>
              <IonRadio slot="start" value="Tidak perlu" />
            </IonItem>
          </IonRadioGroup>

          <IonRadioGroup value={q3} onIonChange={e => setQ3(e.detail.value)}>
            <IonListHeader>
              <IonLabel>3. Apakah Anda memerlukan video profesional untuk iklan atau branding?</IonLabel>
            </IonListHeader>
            <IonItem>
              <IonLabel>Ya</IonLabel>
              <IonRadio slot="start" value="Ya" />
            </IonItem>
            <IonItem>
              <IonLabel>Mungkin</IonLabel>
              <IonRadio slot="start" value="Mungkin" />
            </IonItem>
            <IonItem>
              <IonLabel>Tidak</IonLabel>
              <IonRadio slot="start" value="Tidak" />
            </IonItem>
          </IonRadioGroup>

          <IonRadioGroup value={q4} onIonChange={e => setQ4(e.detail.value)}>
            <IonListHeader>
              <IonLabel>4. Prioritas utama Anda saat ini apa?</IonLabel>
            </IonListHeader>
            <IonItem>
              <IonLabel>Website</IonLabel>
              <IonRadio slot="start" value="Website" />
            </IonItem>
            <IonItem>
              <IonLabel>Automasi/AI</IonLabel>
              <IonRadio slot="start" value="Automasi/AI" />
            </IonItem>
            <IonItem>
              <IonLabel>Video marketing</IonLabel>
              <IonRadio slot="start" value="Video marketing" />
            </IonItem>
            <IonItem>
              <IonLabel>Branding</IonLabel>
              <IonRadio slot="start" value="Branding" />
            </IonItem>
            <IonItem>
              <IonLabel>Kombinasi</IonLabel>
              <IonRadio slot="start" value="Kombinasi" />
            </IonItem>
          </IonRadioGroup>

          <IonRadioGroup value={q5} onIonChange={e => setQ5(e.detail.value)}>
            <IonListHeader>
              <IonLabel>5. Maukah anda mencoba DEMO Website dengan Chat otomatis AI sehingga bisa menghandle lebih dari ribuan pelanggan tanpa terganggu ?</IonLabel>
            </IonListHeader>
            <IonItem>
              <IonLabel>Siap</IonLabel>
              <IonRadio slot="start" value="Siap" />
            </IonItem>
            <IonItem>
              <IonLabel>Siap setelah konsultasi</IonLabel>
              <IonRadio slot="start" value="Siap setelah konsultasi" />
            </IonItem>
            <IonItem>
              <IonLabel>Belum siap</IonLabel>
              <IonRadio slot="start" value="Belum siap" />
            </IonItem>
          </IonRadioGroup>

          <IonButton expand="block" onClick={handleSubmit} className="ion-margin-top">
            Submit Survey
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default FormAI;
