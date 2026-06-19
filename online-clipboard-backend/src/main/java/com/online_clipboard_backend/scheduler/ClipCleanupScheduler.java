package com.online_clipboard_backend.scheduler;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.online_clipboard_backend.entity.Clip;
import com.online_clipboard_backend.repository.ClipRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.cache.annotation.CacheEvict;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ClipCleanupScheduler {

    private final ClipRepository clipRepository;
    private final Cloudinary cloudinary;

    //12 hours
    @Scheduled(fixedRate = 43200000)
    @Transactional
    @CacheEvict(value = {"clips", "publicClips", "publicUserClips"}, allEntries = true)
    public void deleteExpiredClips() {
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(24);


        List<Clip> expiredClips = clipRepository.findByCreatedAtBefore(cutoffTime);


        for (Clip clip : expiredClips) {
            if (clip.getCloudinaryPublicId() != null) {
                try {
                    cloudinary.uploader().destroy(
                            clip.getCloudinaryPublicId(),
                            ObjectUtils.asMap("resource_type", clip.getCloudinaryResourceType())
                    );
                } catch (Exception e) {
                    System.err.println("Failed to delete Cloudinary file: " + e.getMessage());
                }
            }
        }


        clipRepository.deleteAll(expiredClips);

        System.out.println("System Cleanup: Destroyed files and deleted " + expiredClips.size() + " clips older than 24 hours.");
    }
}