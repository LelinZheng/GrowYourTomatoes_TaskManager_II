package com.lelin.tomato;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lelin.tomato.model.Punishment;
import com.lelin.tomato.model.PunishmentType;
import com.lelin.tomato.model.Task;
import com.lelin.tomato.model.User;
import com.lelin.tomato.repository.PunishmentRepository;
import com.lelin.tomato.repository.TaskRepository;
import com.lelin.tomato.repository.TomatoRepository;
import com.lelin.tomato.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Testcontainers
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiIntegrationTest {

  @Container
  static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
      .withDatabaseName("tomato_test")
      .withUsername("test")
      .withPassword("test");

  @DynamicPropertySource
  static void props(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", mysql::getJdbcUrl);
    registry.add("spring.datasource.username", mysql::getUsername);
    registry.add("spring.datasource.password", mysql::getPassword);
  }

  @Autowired MockMvc mockMvc;
  @Autowired ObjectMapper objectMapper;

  @Autowired TaskRepository taskRepository;
  @Autowired TomatoRepository tomatoRepository;
  @Autowired PunishmentRepository punishmentRepository;
  @Autowired UserRepository userRepository;

  @BeforeEach
  void cleanDb() {
    // Order matters if you have constraints
    tomatoRepository.deleteAll();
    punishmentRepository.deleteAll();
    taskRepository.deleteAll();
  }

  // -----------------------
  // Helpers
  // -----------------------

  private String registerAndLoginGetToken(String email, String username, String password) throws Exception {
    // register returns a string message
    mockMvc.perform(post("/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(Map.of(
                "email", email,
                "username", username,
                "password", password
            ))))
        .andExpect(status().isOk());

    String loginJson = mockMvc.perform(post("/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(Map.of(
                "email", email,
                "password", password
            ))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").exists())
        .andReturn()
        .getResponse()
        .getContentAsString();

    JsonNode node = objectMapper.readTree(loginJson);
    return node.get("token").asText();
  }

  private long getTomatoCount(String token) throws Exception {
    String body = mockMvc.perform(get("/tomatoes/count")
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andReturn().getResponse().getContentAsString();

    return Long.parseLong(body);
  }

  private int unauthStatusOf(String method, String path) throws Exception {
    return switch (method) {
      case "GET" -> mockMvc.perform(get(path)).andReturn().getResponse().getStatus();
      case "POST" -> mockMvc.perform(post(path)).andReturn().getResponse().getStatus();
      case "PUT" -> mockMvc.perform(put(path)).andReturn().getResponse().getStatus();
      case "DELETE" -> mockMvc.perform(delete(path)).andReturn().getResponse().getStatus();
      default -> throw new IllegalArgumentException("method");
    };
  }

  @Test
  void register_and_login_returns_token() throws Exception {
    String token = registerAndLoginGetToken("it1@example.com", "it1", "Password123!");
    assertThat(token).isNotBlank();
  }

  @Test
  void get_tasks_requires_jwt() throws Exception {
    int status = unauthStatusOf("GET", "/tasks");
    // Spring Security often returns 401 or 403 depending on config
    assertThat(status == 401 || status == 403).isTrue();
  }

  @Test
  void get_tasks_with_jwt_returns_200() throws Exception {
    String token = registerAndLoginGetToken("it2@example.com", "it2", "Password123!");
    mockMvc.perform(get("/tasks")
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk());
  }

  @Test
  void post_tasks_creates_task() throws Exception {
    String token = registerAndLoginGetToken("it3@example.com", "it3", "Password123!");

    Map<String, Object> payload = new HashMap<>();
    payload.put("title", "My Task");
    payload.put("description", "desc");
    payload.put("priority", "MEDIUM");
    payload.put("timeBombEnabled", false);

    mockMvc.perform(post("/tasks")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").exists())
        .andExpect(jsonPath("$.title").value("My Task"));

    assertThat(taskRepository.findAll()).hasSize(1);
  }

  @Test
  void complete_task_when_expired_earns_tomato_and_count_is_correct() throws Exception {
    String token = registerAndLoginGetToken("it4@example.com", "it4", "Password123!");


    Map<String, Object> payload = new HashMap<>();
    payload.put("title", "Expired Task");
    payload.put("description", "");
    payload.put("priority", "MEDIUM");
    payload.put("timeBombEnabled", false);

    String created = mockMvc.perform(post("/tasks")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();

    long taskId = objectMapper.readTree(created).get("id").asLong();

    // force expired in DB so the /complete takes expired branch
    Task task = taskRepository.findById(taskId).orElseThrow();
    task.setExpired(true);
    taskRepository.save(task);

    mockMvc.perform(put("/tasks/" + taskId + "/complete")
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk());

    assertThat(getTomatoCount(token)).isEqualTo(1);

    Task after = taskRepository.findById(taskId).orElseThrow();
    assertThat(after.isCompleted()).isTrue();
    assertThat(after.getTomatoesEarned()).isEqualTo(1);
  }

  @Test
  void complete_fresh_task_with_active_punishment_resolves_punishment_and_earns_no_tomato() throws Exception {
    String token = registerAndLoginGetToken("it5@example.com", "it5", "Password123!");

    // create an active punishment directly in DB (resolved = false)
    User user = userRepository.findByEmail("it5@example.com")
        .orElseThrow(() -> new IllegalStateException("User not found"));
    Task task = taskRepository.save(Task.builder()
        .title("t1")
        .userId(user.getId())
        .createdAt(LocalDateTime.now())
        .timeBombEnabled(true)
        .dueTime(LocalDateTime.now().plusSeconds(2))
        .completed(false)
        .expired(false)
        .build());

    Punishment p = new Punishment();
    p.setType(PunishmentType.WEEDS);
    p.setUserId(user.getId());
    p.setTaskId(task.getId());
    p.setResolved(false);
    punishmentRepository.save(p);

    // Create a fresh task (not expired)
    Map<String, Object> payload = new HashMap<>();
    payload.put("title", "Fresh Task");
    payload.put("description", "");
    payload.put("priority", "MEDIUM");
    payload.put("timeBombEnabled", false);

    String created = mockMvc.perform(post("/tasks")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();

    long taskId = objectMapper.readTree(created).get("id").asLong();

    // complete -> should resolve punishment and NOT add tomato
    mockMvc.perform(put("/tasks/" + taskId + "/complete")
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk());

    assertThat(getTomatoCount(token)).isEqualTo(0);

    // punishment should be resolved now
    var active = punishmentRepository.findByUserIdAndResolvedFalse(1L);
    assertThat(active).isEmpty();

    Task after = taskRepository.findById(taskId).orElseThrow();
    assertThat(after.getTomatoesEarned()).isEqualTo(0);
  }

  @Test
  void delete_completed_task_rolls_back_tomato_if_tomatoesEarned_gt_0() throws Exception {
    String token = registerAndLoginGetToken("it6@example.com", "it6", "Password123!");

    // Create task
    Map<String, Object> payload = new HashMap<>();
    payload.put("title", "Earn tomato then delete");
    payload.put("description", "");
    payload.put("priority", "MEDIUM");
    payload.put("timeBombEnabled", false);

    String created = mockMvc.perform(post("/tasks")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(payload)))
        .andExpect(status().isOk())
        .andReturn()
        .getResponse()
        .getContentAsString();

    long taskId = objectMapper.readTree(created).get("id").asLong();

    // Force expired so completion earns tomato
    Task task = taskRepository.findById(taskId).orElseThrow();
    task.setExpired(true);
    taskRepository.save(task);

    // Complete -> earns 1 tomato
    mockMvc.perform(put("/tasks/" + taskId + "/complete")
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk());

    assertThat(getTomatoCount(token)).isEqualTo(1);

    // Delete -> your service should remove tomato(s) linked to this task
    mockMvc.perform(delete("/tasks/" + taskId)
            .header("Authorization", "Bearer " + token))
        .andExpect(status().isOk());

    assertThat(getTomatoCount(token)).isEqualTo(0);
    assertThat(tomatoRepository.countByUserIdAndTaskId(1L, taskId)).isEqualTo(0);
  }

  @Test
  void tomatoes_count_endpoint_correct_initially_zero() throws Exception {
    String token = registerAndLoginGetToken("it7@example.com", "it7", "Password123!");
    assertThat(getTomatoCount(token)).isEqualTo(0);
  }
}
