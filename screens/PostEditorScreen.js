import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, Image, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';

const STEPS = ['Select', 'Arrange', 'Caption', 'Publish'];

async function generateCaptions(pillar, photoCount) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: `You are a social media content strategist. Generate exactly 3 different Instagram captions for a ${photoCount}-photo carousel post about "${pillar}" content. Each caption should be engaging, authentic, and end with 5 relevant hashtags. Respond ONLY with a JSON array of 3 strings, no other text. Example format: ["caption 1", "caption 2", "caption 3"]`,
        }],
      }),
    });
    const data = await response.json();
    const text = data?.content?.[0]?.text?.trim() || '[]';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    return [
      `Living through the lens of ${pillar}. Every moment is content waiting to be told. #${pillar.replace(/\s+/g, '')} #content #creator #authentic #lifestyle`,
      `This is what ${pillar} looks like from the inside. No filters on the experience. #${pillar.replace(/\s+/g, '')} #real #moments #contentcreator #atlas`,
      `The story behind the post. ${pillar} is not just what I do — it is who I am. #${pillar.replace(/\s+/g, '')} #storytelling #contentpillar #pvlabs #atlasai`,
    ];
  }
}

export default function PostEditorScreen({ navigation, route }) {
  const cluster = route?.params?.cluster || null;
  const pillar = cluster?.pillar || 'Content';
  const pillarColor = cluster?.color || '#38BDF8';

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [arrangedPhotos, setArrangedPhotos] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState(0);
  const [customCaption, setCustomCaption] = useState('');
  const [writingOwn, setWritingOwn] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(true);
  const [loadingCaptions, setLoadingCaptions] = useState(false);
  const [platform, setPlatform] = useState('Instagram');
  const [postType, setPostType] = useState('Carousel');

  useEffect(() => {
    if (cluster?.assets?.length > 0) {
      const initial = cluster.assets.slice(0, 6);
      setSelectedPhotos(initial);
      setArrangedPhotos(initial);
    }
  }, [cluster]);

  const togglePhoto = (asset) => {
    setSelectedPhotos(prev => {
      const exists = prev.find(p => p.uri === asset.uri);
      if (exists) return prev.filter(p => p.uri !== asset.uri);
      return [...prev, asset];
    });
  };

  const isSelected = (asset) => selectedPhotos.some(p => p.uri === asset.uri);

  const moveUp = (index) => {
    if (index === 0) return;
    const arr = [...arrangedPhotos];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    setArrangedPhotos(arr);
  };

  const moveDown = (index) => {
    if (index === arrangedPhotos.length - 1) return;
    const arr = [...arrangedPhotos];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    setArrangedPhotos(arr);
  };

  const goToStep = async (step) => {
    if (step === 1) setArrangedPhotos([...selectedPhotos]);
    if (step === 2 && captions.length === 0) {
      setLoadingCaptions(true);
      const generated = await generateCaptions(pillar, selectedPhotos.length);
      setCaptions(generated);
      setLoadingCaptions(false);
    }
    setCurrentStep(step);
  };

  const addMorePhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const newAssets = result.assets.map(a => ({ uri: a.uri, filename: a.fileName || 'photo' }));
      setSelectedPhotos(prev => [...prev, ...newAssets]);
    }
  };

  const finalCaption = writingOwn ? customCaption : (captions[selectedCaption] || '');

  return (
    <SafeAreaView style={styles.container}>

      <Modal visible={showAIPopup && cluster !== null} transparent animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={styles.popupCard}>
            <View style={[styles.popupBadge, { backgroundColor: pillarColor + '20' }]}>
              <Text style={[styles.popupBadgeText, { color: pillarColor }]}>AI CURATOR</Text>
            </View>
            <Text style={styles.popupTitle}>We picked your best shots</Text>
            <Text style={styles.popupDescription}>
              Atlas AI found {cluster?.count || 0} photos in your {pillar} cluster and pre-selected the top {Math.min(6, cluster?.assets?.length || 0)} for this post. You can add or remove any photos.
            </Text>
            <TouchableOpacity style={[styles.popupButton, { backgroundColor: pillarColor }]} onPress={() => setShowAIPopup(false)}>
              <Text style={styles.popupButtonText}>Got it, show me the photos</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Post Editor</Text>
        <View style={[styles.pillarBadge, { backgroundColor: pillarColor + '20' }]}>
          <Text style={[styles.pillarBadgeText, { color: pillarColor }]}>{pillar.split(' ')[0]}</Text>
        </View>
      </View>

      <View style={styles.stepRow}>
        {STEPS.map((step, index) => (
          <TouchableOpacity key={step} style={styles.stepItem} onPress={() => index < currentStep && goToStep(index)}>
            <View style={[
              styles.stepDot,
              index === currentStep && { backgroundColor: pillarColor, borderColor: pillarColor },
              index < currentStep && styles.stepDotDone,
            ]}>
              <Text style={styles.stepDotText}>{index < currentStep ? '✓' : index + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, index === currentStep && { color: pillarColor }]}>{step}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>

        {currentStep === 0 && (
          <View>
            <Text style={styles.stepTitle}>Select your photos</Text>
            <Text style={styles.stepSubtitle}>AI pre-selected the top shots from your {pillar} cluster.</Text>
            <View style={styles.photoGrid}>
              {(cluster?.assets || []).slice(0, 20).map((asset, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.photoCard, isSelected(asset) && { borderColor: pillarColor }]}
                  onPress={() => togglePhoto(asset)}
                >
                  <Image source={{ uri: asset.uri }} style={styles.photoImage} />
                  {isSelected(asset) && (
                    <View style={[styles.selectedBadge, { backgroundColor: pillarColor }]}>
                      <Text style={styles.selectedBadgeText}>
                        {selectedPhotos.findIndex(p => p.uri === asset.uri) + 1}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addMoreCard} onPress={addMorePhotos}>
                <Text style={styles.addMoreIcon}>+</Text>
                <Text style={styles.addMoreText}>Add More</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.selectionCount}>{selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} selected</Text>
          </View>
        )}

        {currentStep === 1 && (
          <View>
            <Text style={styles.stepTitle}>Arrange your carousel</Text>
            <Text style={styles.stepSubtitle}>First photo is your hook. Use arrows to reorder.</Text>
            {arrangedPhotos.map((asset, index) => (
              <View key={index} style={styles.arrangeRow}>
                <Text style={styles.arrangeIndex}>{index + 1}</Text>
                <Image source={{ uri: asset.uri }} style={styles.arrangeThumb} />
                <View style={styles.arrangeMeta}>
                  {index === 0 && (
                    <View style={[styles.hookBadge, { backgroundColor: pillarColor + '20' }]}>
                      <Text style={[styles.hookBadgeText, { color: pillarColor }]}>HOOK</Text>
                    </View>
                  )}
                  <Text style={styles.arrangeFilename} numberOfLines={1}>
                    {asset.filename || `Photo ${index + 1}`}
                  </Text>
                </View>
                <View style={styles.arrowBtns}>
                  <TouchableOpacity onPress={() => moveUp(index)} style={styles.arrowBtn}>
                    <Text style={styles.arrowText}>↑</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => moveDown(index)} style={styles.arrowBtn}>
                    <Text style={styles.arrowText}>↓</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {currentStep === 2 && (
          <View>
            <Text style={styles.stepTitle}>Choose your caption</Text>
            <Text style={styles.stepSubtitle}>AI generated 3 options based on your {pillar} pillar.</Text>
            {loadingCaptions ? (
              <View style={styles.loadingCaptions}>
                <ActivityIndicator color={pillarColor} />
                <Text style={styles.loadingCaptionsText}>Generating captions with AI...</Text>
              </View>
            ) : (
              <>
                {captions.map((caption, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.captionCard, !writingOwn && selectedCaption === index && { borderColor: pillarColor }]}
                    onPress={() => { setSelectedCaption(index); setWritingOwn(false); }}
                  >
                    <View style={styles.captionHeader}>
                      <Text style={styles.captionOption}>Option {index + 1}</Text>
                      {!writingOwn && selectedCaption === index && (
                        <Text style={[styles.captionSelectedText, { color: pillarColor }]}>Selected</Text>
                      )}
                    </View>
                    <Text style={styles.captionText}>{caption}</Text>
                  </TouchableOpacity>
                ))}
                {writingOwn ? (
                  <View style={[styles.captionCard, { borderColor: pillarColor }]}>
                    <Text style={styles.captionOption}>Your Caption</Text>
                    <TextInput
                      style={styles.captionInput}
                      value={customCaption}
                      onChangeText={setCustomCaption}
                      multiline
                      placeholder="Write your caption..."
                      placeholderTextColor="#475569"
                      autoFocus
                    />
                  </View>
                ) : (
                  <TouchableOpacity style={[styles.writeOwnButton, { borderColor: pillarColor }]} onPress={() => setWritingOwn(true)}>
                    <Text style={[styles.writeOwnText, { color: pillarColor }]}>✏️  Write My Own Caption</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}

        {currentStep === 3 && (
          <View>
            <Text style={styles.stepTitle}>Ready to publish</Text>
            <Text style={styles.stepSubtitle}>Review your post before scheduling.</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewStrip}>
              {arrangedPhotos.map((asset, index) => (
                <View key={index} style={styles.previewThumb}>
                  <Image source={{ uri: asset.uri }} style={styles.previewImage} />
                  {index === 0 && (
                    <View style={[styles.hookTag, { backgroundColor: pillarColor }]}>
                      <Text style={styles.hookTagText}>HOOK</Text>
                    </View>
                  )}
                  <Text style={styles.previewIndex}>{index + 1}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.captionPreviewCard}>
              <Text style={styles.captionPreviewLabel}>CAPTION</Text>
              <Text style={styles.captionPreviewText} numberOfLines={4}>{finalCaption || 'No caption selected'}</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Photos</Text>
                <Text style={styles.summaryValue}>{arrangedPhotos.length} selected</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Pillar</Text>
                <Text style={[styles.summaryValue, { color: pillarColor }]}>{pillar}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Platform</Text>
                <View style={styles.platformRow}>
                  {['Instagram', 'TikTok', 'Both'].map(p => (
                    <TouchableOpacity
                      key={p}
                      style={[styles.platformBtn, platform === p && { backgroundColor: pillarColor + '30', borderColor: pillarColor }]}
                      onPress={() => setPlatform(p)}
                    >
                      <Text style={[styles.platformBtnText, platform === p && { color: pillarColor }]}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Post Type</Text>
                <View style={styles.platformRow}>
                  {['Carousel', 'Reel', 'Story'].map(t => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.platformBtn, postType === t && { backgroundColor: pillarColor + '30', borderColor: pillarColor }]}
                      onPress={() => setPostType(t)}
                    >
                      <Text style={[styles.platformBtnText, postType === t && { color: pillarColor }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity style={[styles.publishButton, { backgroundColor: pillarColor }]}>
              <Text style={styles.publishButtonText}>Schedule Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.publishNowButton}>
              <Text style={styles.publishNowButtonText}>Save as Draft</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      <View style={styles.navButtons}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(currentStep - 1)}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        {currentStep < STEPS.length - 1 && (
          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: pillarColor, opacity: selectedPhotos.length === 0 && currentStep === 0 ? 0.4 : 1 }]}
            onPress={() => goToStep(currentStep + 1)}
            disabled={selectedPhotos.length === 0 && currentStep === 0}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 1 ? 'Generate Captions →' : 'Next →'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E', paddingHorizontal: 20 },
  popupOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.88)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  popupCard: { backgroundColor: '#0F172A', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#38BDF840', width: '100%' },
  popupBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 16 },
  popupBadgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  popupTitle: { color: '#F1F5F9', fontSize: 22, fontWeight: '900', marginBottom: 12 },
  popupDescription: { color: '#94A3B8', fontSize: 14, lineHeight: 22, marginBottom: 20 },
  popupButton: { paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  popupButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginBottom: 20 },
  backArrow: { color: '#94A3B8', fontSize: 22, fontWeight: '600', paddingRight: 8 },
  title: { color: '#F1F5F9', fontSize: 22, fontWeight: '800' },
  pillarBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  pillarBadgeText: { fontSize: 12, fontWeight: '700' },
  stepRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  stepItem: { alignItems: 'center', gap: 6 },
  stepDot: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E293B' },
  stepDotDone: { backgroundColor: '#34D399', borderColor: '#34D399' },
  stepDotText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stepLabel: { color: '#475569', fontSize: 11, fontWeight: '600' },
  scrollArea: { flex: 1 },
  stepTitle: { color: '#F1F5F9', fontSize: 20, fontWeight: '700', marginBottom: 6 },
  stepSubtitle: { color: '#94A3B8', fontSize: 13, marginBottom: 20, lineHeight: 18 },
  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  photoCard: { width: '31%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  photoImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  selectedBadge: { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  selectedBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  addMoreCard: { width: '31%', aspectRatio: 1, borderRadius: 12, borderWidth: 1, borderColor: '#1E293B', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111827' },
  addMoreIcon: { color: '#94A3B8', fontSize: 28, fontWeight: '300' },
  addMoreText: { color: '#94A3B8', fontSize: 11, marginTop: 4 },
  selectionCount: { color: '#94A3B8', fontSize: 13, textAlign: 'center', marginBottom: 20 },
  arrangeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12, backgroundColor: '#111827', borderRadius: 14, padding: 12 },
  arrangeIndex: { color: '#94A3B8', fontSize: 16, fontWeight: '700', width: 20 },
  arrangeThumb: { width: 52, height: 52, borderRadius: 10, resizeMode: 'cover' },
  arrangeMeta: { flex: 1, gap: 4 },
  hookBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, alignSelf: 'flex-start' },
  hookBadgeText: { fontSize: 10, fontWeight: '700' },
  arrangeFilename: { color: '#94A3B8', fontSize: 12 },
  arrowBtns: { gap: 4 },
  arrowBtn: { backgroundColor: '#1E293B', width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  arrowText: { color: '#94A3B8', fontSize: 14 },
  loadingCaptions: { alignItems: 'center', gap: 12, paddingVertical: 40 },
  loadingCaptionsText: { color: '#94A3B8', fontSize: 14 },
  captionCard: { backgroundColor: '#111827', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: 'transparent' },
  captionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  captionOption: { color: '#94A3B8', fontSize: 12, fontWeight: '700' },
  captionSelectedText: { fontSize: 12, fontWeight: '700' },
  captionText: { color: '#F1F5F9', fontSize: 13, lineHeight: 20 },
  captionInput: { color: '#F1F5F9', fontSize: 13, lineHeight: 20, minHeight: 100, textAlignVertical: 'top' },
  writeOwnButton: { borderWidth: 1, borderStyle: 'dashed', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 4, marginBottom: 20 },
  writeOwnText: { fontSize: 14, fontWeight: '600' },
  previewStrip: { marginBottom: 16 },
  previewThumb: { width: 90, height: 90, borderRadius: 12, marginRight: 10, overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  hookTag: { position: 'absolute', bottom: 4, left: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  hookTagText: { color: '#fff', fontSize: 8, fontWeight: '800' },
  previewIndex: { position: 'absolute', top: 4, right: 6, color: '#fff', fontSize: 11, fontWeight: '800' },
  captionPreviewCard: { backgroundColor: '#111827', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#1E293B' },
  captionPreviewLabel: { color: '#94A3B8', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  captionPreviewText: { color: '#F1F5F9', fontSize: 13, lineHeight: 20 },
  summaryCard: { backgroundColor: '#111827', borderRadius: 14, padding: 16, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  summaryLabel: { color: '#94A3B8', fontSize: 14 },
  summaryValue: { color: '#F1F5F9', fontSize: 14, fontWeight: '600' },
  platformRow: { flexDirection: 'row', gap: 6 },
  platformBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#1E293B' },
  platformBtnText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#1E293B' },
  publishButton: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 12 },
  publishButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  publishNowButton: { paddingVertical: 14, alignItems: 'center', marginBottom: 32 },
  publishNowButtonText: { color: '#94A3B8', fontSize: 14 },
  navButtons: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, gap: 12 },
  backButton: { flex: 1, backgroundColor: '#111827', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  backButtonText: { color: '#F1F5F9', fontSize: 14, fontWeight: '600' },
  nextButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  nextButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
