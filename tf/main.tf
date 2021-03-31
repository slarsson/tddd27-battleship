terraform {
    required_providers {
        digitalocean = {
            source = "digitalocean/digitalocean"
        }
    }
}

variable do_token {}

provider digitalocean {
    token = var.do_token
}

data "digitalocean_ssh_key" "home" {
    name = "desktop"
}

resource "digitalocean_droplet" "web" {
    image  = "ubuntu-20-04-x64"
    name   = "tddd27-web-1"
    region = "lon1"
    size   = "s-1vcpu-1gb-intel"
    ssh_keys = [data.digitalocean_ssh_key.home.id]

    connection {
        type = "ssh"
        user = "root"
        host = self.ipv4_address
        agent = true
    }

    # install docker + docker-compose
    provisioner "remote-exec" {
        inline = [
            "apt-get update",
            "apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release",
            "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg",
            "echo \"deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null",
            "apt-get update",
            "apt-get install -y docker-ce docker-ce-cli containerd.io",
            "curl -L \"https://github.com/docker/compose/releases/download/1.28.6/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose",
            "chmod +x /usr/local/bin/docker-compose"
        ]
    }
}

output "server_ip" {
    value = digitalocean_droplet.web.ipv4_address
}
