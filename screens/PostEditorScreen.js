import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

const STEPS = ['Select', 'Arrange', 'Caption', 'Publish'];
const MOCK_PHOTOS = [
  { id: 1, label: 'Pre-jump prep', ai: true },
  { id: 2, label: 'At altitude', ai: false },
  { id: 3, label: 'Exit moment', ai: true },
  { id: 4, label: 'Freefall', ai: true },
  { id: 5, label: 'Canopy open', ai: false },
  { id: 6, label: 'Landing view', ai: true },
];
const CAPTIONS = [
  'The moment before you jump tells you everything about who you are. The moment after tells you who you are becoming.',
  '14,000 feet of perspective. Some lessons you can only learn in freefall.',
  'They asked me if I was scared. I said yes. I jumped anyway. That is the whole lesson.',
];

export default function PostEditorScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState([1, 3, 4, 6]);
  const [selectedCaption, setSelectedCaption] = useState(0);
  const [showAIPopup, setShowAIPopup] = useState(true);
  const [dontShow, setDontShow] = useState(false);

  const togglePhoto = (id) => {
    setSelectedPhotos(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={showAIPopup} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <View style={styles.popupBadge}>
              <Text style={styles.popupBadgeText}>AI CURATOR</Text>
            </View>
            <Text style={styles.popupTitle}>We picked your best shots</Text>
            <Text style={styles.popupDescription}>
              Our AI analyzed all 14 photos from your skydiving session and selected the 4 most visually compelling shots based on your Adrenaline pillar strategy and past post performance.
            </Text>
            <Text style={styles.popupSubtext}>You can add or remove any photos after dismissing this.</Text>
            <TouchableOpacity style={styles.dontShowRow} onPress={() => setDontShow(!dontShow)}>
              <View style={[styles.checkbox, dontShow && styles.checkboxActive]}>
                {dontShow && <Text style={styles.checkmark}>v</Text>}
              </View>
              <Text style={styles.dontShowText}>Do not show this again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.popupButton} onPress={() => setShowAIPopup(false)}>
              <Text style={styles.popupButtonText}>Got it, show me the photos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.title}>Post Editor</Text>
        <View style={styles.pillarBadge}>
          <Text style={styles.pillarBadgeText}>Adrenaline</Text>
        </View>
      </View>

      <View style={styles.stepRow}>
        {STEPS.map((step, index) => (
          <TouchableOpacity key={step} style={styles.stepItem} onPress={() => setCurrentStep(index)}>
            <View style={[styles.stepDot, index === currentStep && styles.stepDotActive, index < currentStep && styles.stepDotDone]}>
              <Text style={styles.stepDotText}>{index < currentStep ? 'v' : index + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, index === currentStep && styles.stepLabelActive]}>{step}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {currentStep === 0 && (
          <View>
            <Text style={styles.stepTitle}>Select your photos</Text>
            <Text style={styles.stepSubtitle}>AI selected the best 4. Tap to add or remove.</Text>
            <View style={styles.photoGrid}>
              {MOCK_PHOTOS.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={[styles.photoCard, selectedPhotos.includes(photo.id) && styles.photoCardSelected]}
                  onPress={() => togglePhoto(photo.id)}
                >
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoPlaceholderText}>{photo.id}</Text>
                  </View>
                  <Text style={styles.photoCaption}>{photo.label}</Text>
                  {photo.ai && <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI</Text></View>}
                  {selectedPhotos.includes(photo.id) && <View style={styles.selectedBadge}><Text style={styles.selectedBadgeText}>v</Text></View>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {currentStep === 1 && (
          <View>
            <Text style={styles.stepTitle}>Arrange your carousel</Text>
            <Text style={styles.stepSubtitle}>Drag to reorder. First photo is your hook.</Text>
            {selectedPhotos.map((id, index) => {
              const photo = MOCK_PHOTOS.find(p => p.id === id);
              return (
                <View key={id} style={styles.arrangeRow}>
                  <Text style={styles.arrangeIndex}>{index + 1}</Text>
                  <View style={styles.arrangeCard}>
                    <View style={styles.arrangeThumb}><Text style={styles.arrangeThumbText}>{photo.id}</Text></View>
                    <Text style={styles.arrangeCaption}>{photo.label}</Text>
                  </View>
                  <Text style={styles.hamburger}>|||</Text>
                  {index === 0 && <View style={styles.hookBadge}><Text style={styles.hookBadgeText}>HOOK</Text></View>}
                </View>
              );
            })}
          </View>
        )}
        {currentStep === 2 && (
          <View>
            <Text style={styles.stepTitle}>Choose your caption</Text>
            <Text style={styles.stepSubtitle}>AI generated 3 options. Pick one or write your own.</Text>
            {CAPTIONS.map((caption, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.captionCard, selectedCaption === index && styles.captionCardSelected]}
                onPress={() => setSelectedCaption(index)}
              >
                <View style={styles.captionHeader}>
                  <Text style={styles.captionOption}>Option {index + 1}</Text>
                  {selectedCaption === index && <Text style={styles.captionSelectedText}>Selected</Text>}
                </View>
                <Text style={styles.captionText}>{caption}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.writeOwnButton}>
              <Text style={styles.writeOwnText}>Write My Own Caption</Text>
            </TouchableOpacity>
          </View>
        )}
        {currentStep === 3 && (
          <View>
            <Text style={styles.stepTitle}>Ready to publish</Text>
            <Text style={styles.stepSubtitle}>Review your post before it goes live.</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewStrip}>
              {selectedPhotos.map((id, index) => {
                const photo = MOCK_PHOTOS.find(p => p.id === id);
                return (
                  <View key={id} style={styles.previewThumb}>
                    <Text style={styles.previewThumbText}>{photo.id}</Text>
                    <Text style={styles.previewIndex}>{index + 1}</Text>
                  </View>
                );
              })}
            </ScrollView>
            <View style={styles.aiExplainCard}>
              <Text style={styles.aiExplainTitle}>Why the AI chose these</Text>
              <Text style={styles.aiExplainText}>Photo 1 was selected as the hook due to high visual contrast. Photos 2 and 3 build a narrative arc. The final photo creates a strong closing impression inspired by your top Adrenaline pillar posts.</Text>
            </View>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Photos</Text><Text style={styles.summaryValue}>{selectedPhotos.length} selected</Text></View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Platform</Text><Text style={styles.summaryValue}>Instagram + TikTok</Text></View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Post Type</Text><Text style={styles.summaryValue}>Carousel</Text></View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Schedule</Text><Text style={styles.summaryValue}>Tomorrow 9:00 AM</Text></View>
            </View>
            <TouchableOpacity style={styles.publishButton}><Text style={styles.publishButtonText}>Schedule Post</Text></TouchableOpacity>
            <TouchableOpacity style={styles.publishNowButton}><Text style={styles.publishNowButtonText}>Publish Now</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.navButtons}>
        {currentStep > 0 && <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(currentStep - 1)}><Text style={styles.backButtonText}>Back</Text></TouchableOpacity>}
        {currentStep < STEPS.length - 1 && <TouchableOpacity style={styles.nextButton} onPress={() => setCurrentStep(currentStep + 1)}><Text style={styles.nextButtonText}>Next</Text></TouchableOpacity>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', paddingHorizontal: 20 },
  popupOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.88)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  popupCard: { backgroundColor: '#1a1a2e', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#ff6b3540', width: '100%' },
  popupBadge: { backgroundColor: '#ff6b3520', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 16 },
  popupBadgeText: { color: '#ff6b35', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  popupTitle: { color: '#fff', fontSize: 22, fontWeight: '900', marginBottom: 12 },
  popupDescription: { color: '#aaa', fontSize: 14, lineHeight: 22, marginBottom: 12 },
  popupSubtext: { color: '#666', fontSize: 13, lineHeight: 20, marginBottom: 20 },
  dontShowRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: '#555', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#ff6b35', borderColor: '#ff6b35' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  dontShowText: { color: '#888', fontSize: 13 },
  popupButton: { backgroundColor: '#ff6b35', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  popupButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, marginBottom: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  pillarBadge: { backgroundColor: '#ff6b3520', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pillarBadgeText: { color: '#ff6b35', fontSize: 12, fontWeight: '700' },
  stepRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  stepItem: { alignItems: 'center', gap: 6 },
  stepDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333' },
  stepDotActive: { backgroundColor: '#ff6b35', borderColor: '#ff6b35' },
  stepDotDone: { backgroundColor: '#4ecdc4', borderColor: '#4ecdc4' },
  stepDotText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stepLabel: { color: '#555', fontSize: 11, fontWeight: '600' },
  stepLabelActive: { color: '#ff6b35' },
  stepTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 6 },
  stepSubtitle: { color: '#666', fontSize: 13, marginBottom: 20, lineHeight: 18 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  photoCard: { width: '47%', backgroundColor: '#1a1a1a', borderRadius: 14, padding: 12, borderWidth: 2, borderColor: 'transparent' },
  photoCardSelected: { borderColor: '#ff6b35' },
  photoPlaceholder: { width: '100%', height: 80, backgroundColor: '#2a2a2a', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  photoPlaceholderText: { color: '#555', fontSize: 24, fontWeight: '800' },
  photoCaption: { color: '#888', fontSize: 12 },
  aiBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#ff6b35', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  aiBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  selectedBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#ff6b35', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  selectedBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  arrangeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  arrangeIndex: { color: '#666', fontSize: 16, fontWeight: '700', width: 20 },
  arrangeCard: { flex: 1, backgroundColor: '#1a1a1a', borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  arrangeThumb: { width: 40, height: 40, backgroundColor: '#2a2a2a', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  arrangeThumbText: { color: '#555', fontSize: 16, fontWeight: '800' },
  arrangeCaption: { color: '#fff', fontSize: 14 },
  hamburger: { color: '#555', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  hookBadge: { backgroundColor: '#ff6b3520', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  hookBadgeText: { color: '#ff6b35', fontSize: 10, fontWeight: '700' },
  captionCard: { backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  captionCardSelected: { borderColor: '#ff6b35' },
  captionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  captionOption: { color: '#666', fontSize: 12, fontWeight: '700' },
  captionSelectedText: { color: '#ff6b35', fontSize: 12, fontWeight: '700' },
  captionText: { color: '#fff', fontSize: 13, lineHeight: 20 },
  writeOwnButton: { borderWidth: 1, borderColor: '#ff6b35', borderStyle: 'dashed', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 4, marginBottom: 20 },
  writeOwnText: { color: '#ff6b35', fontSize: 14, fontWeight: '600' },
  previewStrip: { marginBottom: 16 },
  previewThumb: { width: 80, height: 80, backgroundColor: '#1a1a1a', borderRadius: 12, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  previewThumbText: { color: '#555', fontSize: 24, fontWeight: '800' },
  previewIndex: { color: '#666', fontSize: 11, marginTop: 4 },
  aiExplainCard: { backgroundColor: '#1a1a2e', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#ff6b3530' },
  aiExplainTitle: { color: '#ff6b35', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  aiExplainText: { color: '#aaa', fontSize: 13, lineHeight: 20 },
  summaryCard: { backgroundColor: '#1a1a1a', borderRadius: 14, padding: 16, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  summaryLabel: { color: '#666', fontSize: 14 },
  summaryValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#2a2a2a' },
  publishButton: { backgroundColor: '#ff6b35', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 12 },
  publishButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  publishNowButton: { paddingVertical: 14, alignItems: 'center' },
  publishNowButtonText: { color: '#666', fontSize: 14 },
  navButtons: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, gap: 12 },
  backButton: { flex: 1, backgroundColor: '#1a1a1a', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  nextButton: { flex: 1, backgroundColor: '#ff6b35', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  nextButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
