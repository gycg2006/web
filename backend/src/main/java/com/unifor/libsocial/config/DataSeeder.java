package com.unifor.libsocial.config;

import com.unifor.libsocial.model.*;
import com.unifor.libsocial.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Random random = new Random();

    @Override
    public void run(String... args) {
        // Verificar se já existem dados
        if (userRepository.count() > 1) { // Mais de 1 porque pode ter o usuário de teste
            System.out.println("Banco de dados já possui dados. Pulando seed...");
            return;
        }

        System.out.println("Iniciando seed do banco de dados...");

        // Criar usuários
        List<User> users = createUsers();
        System.out.println("✓ " + users.size() + " usuários criados");

        // Criar livros
        List<Book> books = createBooks();
        System.out.println("✓ " + books.size() + " livros criados");

        // Criar posts
        List<Post> posts = createPosts(users, books);
        System.out.println("✓ " + posts.size() + " posts criados");

        // Criar likes em posts
        createPostLikes(users, posts);
        System.out.println("✓ Likes em posts criados");

        // Criar amizades
        createFriendships(users);
        System.out.println("✓ Amizades criadas");

        System.out.println("Seed concluído com sucesso!");
    }

    private List<User> createUsers() {
        String[] nomes = {
            "Ana Clara Silva", "Carlos Eduardo Santos", "Mariana Costa", 
            "Pedro Henrique Lima", "Julia Martins", "Lucas Oliveira",
            "Fernanda Souza", "Roberto Alves", "Beatriz Ferreira",
            "Rafael Mendes", "Isabela Rocha", "Thiago Barbosa",
            "Camila Dias", "Gabriel Nunes", "Larissa Araújo"
        };

        // Cursos disponíveis (não usado diretamente, mas pode ser útil para futuras expansões)
        // String[] cursos = {
        //     "Engenharia de Software", "Ciência da Computação", "Direito",
        //     "Medicina", "Psicologia", "Arquitetura", "Jornalismo",
        //     "Administração", "Design Gráfico", "Enfermagem"
        // };

        String[] avatares = {
            "https://i.pravatar.cc/150?u=ana", "https://i.pravatar.cc/150?u=carlos",
            "https://i.pravatar.cc/150?u=mariana", "https://i.pravatar.cc/150?u=pedro",
            "https://i.pravatar.cc/150?u=julia", "https://i.pravatar.cc/150?u=lucas",
            "https://i.pravatar.cc/150?u=fernanda", "https://i.pravatar.cc/150?u=roberto",
            "https://i.pravatar.cc/150?u=beatriz", "https://i.pravatar.cc/150?u=rafael",
            "https://i.pravatar.cc/150?u=isabela", "https://i.pravatar.cc/150?u=thiago",
            "https://i.pravatar.cc/150?u=camila", "https://i.pravatar.cc/150?u=gabriel",
            "https://i.pravatar.cc/150?u=larissa"
        };

        String[] biografias = {
            "Apaixonada por literatura e tecnologia",
            "Desenvolvedor full-stack e leitor ávido",
            "Estudante de direito que adora ler",
            "Médico em formação, sempre com um livro na mão",
            "Designer e amante de livros de ficção",
            "Engenheiro de software e entusiasta de ciência",
            "Jornalista e crítica literária",
            "Administrador e leitor de negócios",
            "Psicóloga que estuda através dos livros",
            "Enfermeiro e leitor de romances"
        };

        List<User> users = new java.util.ArrayList<>();
        
        for (int i = 0; i < nomes.length; i++) {
            User user = new User();
            user.setMatricula(String.format("231%04d", 1000 + i));
            user.setSenha(passwordEncoder.encode("12345678")); // Senha padrão: 12345678
            user.setNome(nomes[i]);
            user.setBio(biografias[i % biografias.length]);
            user.setFotoPerfil(avatares[i % avatares.length]);
            user.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(180)));
            users.add(userRepository.save(user));
        }

        return users;
    }

    private List<Book> createBooks() {
        Book[] books = {
            createBook("5ZFiEQAAQBAJ", "Introdução à Computação", "Vinicius Godoy",
                "IESDE BRASIL SA", "https://books.google.com/books/publisher/content?id=5ZFiEQAAQBAJ&printsec=frontcover&img=1&zoom=1"),
            createBook("dummy1", "Clean Code", "Robert C. Martin",
                "Prentice Hall", "https://i.pravatar.cc/300?u=book1"),
            createBook("dummy2", "Design Patterns", "Gang of Four",
                "Addison-Wesley", "https://i.pravatar.cc/300?u=book2"),
            createBook("dummy3", "O Pequeno Príncipe", "Antoine de Saint-Exupéry",
                "Editora Agir", "https://i.pravatar.cc/300?u=book3"),
            createBook("dummy4", "Duna", "Frank Herbert",
                "Editora Aleph", "https://i.pravatar.cc/300?u=book4"),
            createBook("dummy5", "1984", "George Orwell",
                "Companhia das Letras", "https://i.pravatar.cc/300?u=book5"),
            createBook("dummy6", "A Arte da Guerra", "Sun Tzu",
                "Editora Jardim dos Livros", "https://i.pravatar.cc/300?u=book6"),
            createBook("dummy7", "O Hobbit", "J.R.R. Tolkien",
                "HarperCollins", "https://i.pravatar.cc/300?u=book7"),
            createBook("dummy8", "Código Limpo", "Robert C. Martin",
                "Alta Books", "https://i.pravatar.cc/300?u=book8"),
            createBook("dummy9", "Java: Como Programar", "Paul Deitel",
                "Pearson", "https://i.pravatar.cc/300?u=book9")
        };

        return Arrays.stream(books)
            .map(book -> bookRepository.save(book))
            .toList();
    }

    private Book createBook(String id, String title, String author, String publisher, String thumbnail) {
        Book book = new Book();
        book.setGoogleBooksId(id);
        book.setTitle(title);
        book.setAuthors(author);
        book.setPublisher(publisher);
        book.setThumbnailUrl(thumbnail);
        book.setSmallThumbnailUrl(thumbnail);
        book.setDescription("Descrição do livro " + title);
        book.setPageCount(200 + random.nextInt(400));
        book.setCategories("Tecnologia,Programação");
        return book;
    }

    private List<Post> createPosts(List<User> users, List<Book> books) {
        String[] postContents = {
            "Acabei de terminar este livro e fiquei impressionado com a qualidade do conteúdo! Recomendo muito para quem está começando na área.",
            "Estou lendo este livro há alguns dias e já posso dizer que é uma das melhores leituras do ano. A narrativa é envolvente!",
            "Para quem está estudando programação, este livro é essencial. Os exemplos são claros e práticos.",
            "Uma leitura fundamental para a área. O conteúdo é denso mas muito bem explicado. Recomendo para quem está pagando as cadeiras do ciclo básico!",
            "Este livro mudou minha perspectiva sobre desenvolvimento de software. Leitura obrigatória!",
            "Estou relendo este clássico e descobrindo novos detalhes a cada página. Uma obra-prima!",
            "Acabei de adicionar este livro à minha estante. Alguém mais já leu? Quero trocar ideias!",
            "Este livro me ajudou muito no meu TCC. A bibliografia é excelente e as referências são atualizadas.",
            "Recomendo este livro para todos os estudantes de TI. Os conceitos são explicados de forma didática.",
            "Uma leitura leve e interessante. Perfeito para quem quer aprender sem se sentir sobrecarregado.",
            "Este livro está na minha lista de leitura há meses. Finalmente comecei e não me arrependi!",
            "Para os amantes de ficção científica, este livro é imperdível. A construção do mundo é incrível!",
            "Estou usando este livro como referência no meu trabalho de conclusão de curso. Muito útil!",
            "Este autor nunca decepciona. Mais uma obra excelente para a coleção!",
            "Leitura recomendada pelo meu professor. Estou gostando muito do conteúdo e da abordagem.",
            "Este livro me fez repensar muitas coisas sobre minha carreira. Leitura transformadora!",
            "Para quem gosta de desafios, este livro apresenta exercícios interessantes e desafiadores.",
            "Uma das melhores compras que fiz este ano. O livro superou minhas expectativas!",
            "Estou compartilhando porque este livro me ajudou muito na preparação para as provas.",
            "Este livro é perfeito para quem quer se aprofundar no assunto. Recomendo fortemente!"
        };

        List<Post> posts = new java.util.ArrayList<>();
        LocalDateTime baseTime = LocalDateTime.now().minusDays(30);

        for (int i = 0; i < 30; i++) {
            Post post = new Post();
            post.setUser(users.get(random.nextInt(users.size())));
            
            // 70% dos posts têm livro associado
            if (random.nextDouble() < 0.7) {
                post.setBook(books.get(random.nextInt(books.size())));
            }
            
            post.setContent(postContents[i % postContents.length]);
            
            // 20% dos posts têm imagem
            if (random.nextDouble() < 0.2) {
                post.setImageUrl("https://picsum.photos/800/600?random=" + i);
            }
            
            // Distribuir posts ao longo dos últimos 30 dias
            post.setCreatedAt(baseTime.plusDays(random.nextInt(30)).plusHours(random.nextInt(24)));
            post.setUpdatedAt(post.getCreatedAt());
            
            posts.add(postRepository.save(post));
        }

        return posts;
    }

    private void createPostLikes(List<User> users, List<Post> posts) {
        for (Post post : posts) {
            // Cada post recebe entre 0 e 8 likes de usuários aleatórios
            int numLikes = random.nextInt(9);
            List<User> shuffledUsers = new java.util.ArrayList<>(users);
            java.util.Collections.shuffle(shuffledUsers);

            for (int i = 0; i < numLikes && i < shuffledUsers.size(); i++) {
                User liker = shuffledUsers.get(i);
                // Não deixar o autor curtir seu próprio post
                if (!liker.getId().equals(post.getUser().getId())) {
                    // Verificar se já existe like
                    if (!postLikeRepository.existsByUserIdAndPostId(liker.getId(), post.getId())) {
                        PostLike like = new PostLike();
                        like.setUser(liker);
                        like.setPost(post);
                        // createdAt é definido automaticamente pelo @PrePersist
                        postLikeRepository.save(like);
                    }
                }
            }
        }
    }

    private void createFriendships(List<User> users) {
        // Criar algumas amizades aceitas
        for (int i = 0; i < users.size() - 1; i++) {
            User user1 = users.get(i);
            User user2 = users.get(i + 1);
            
            // 60% de chance de serem amigos
            if (random.nextDouble() < 0.6) {
                Friendship friendship = new Friendship();
                friendship.setUser1(user1);
                friendship.setUser2(user2);
                friendship.setStatus(Friendship.FriendshipStatus.ACCEPTED);
                friendship.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(60)));
                friendship.setAcceptedAt(friendship.getCreatedAt().plusDays(random.nextInt(7)));
                friendshipRepository.save(friendship);
            }
        }

        // Criar algumas amizades pendentes
        for (int i = 0; i < 5; i++) {
            User user1 = users.get(random.nextInt(users.size()));
            User user2 = users.get(random.nextInt(users.size()));
            
            if (!user1.getId().equals(user2.getId())) {
                // Verificar se já existe amizade
                Optional<Friendship> existing1 = friendshipRepository.findByUser1AndUser2(user1, user2);
                Optional<Friendship> existing2 = friendshipRepository.findByUser1AndUser2(user2, user1);
                
                if (existing1.isEmpty() && existing2.isEmpty()) {
                    Friendship friendship = new Friendship();
                    friendship.setUser1(user1);
                    friendship.setUser2(user2);
                    friendship.setStatus(Friendship.FriendshipStatus.PENDING);
                    friendship.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(7)));
                    friendshipRepository.save(friendship);
                }
            }
        }
    }
}

