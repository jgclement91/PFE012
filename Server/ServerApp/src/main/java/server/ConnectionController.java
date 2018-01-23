package server;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ConnectionController 
{
	private static final String template = "Hello, %s!";
	private final AtomicLong counter = new AtomicLong();
	
	@RequestMapping("/connection")
	public Connection connection(@RequestParam(value="name", defaultValue="Anonymous") String name)
	{
		return new Connection(counter.incrementAndGet(), String.format(template, name));
	}
}
